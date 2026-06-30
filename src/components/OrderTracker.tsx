import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { OrderState, CartItem } from '../types';
import { CheckCircle2, Truck, Box, Package, ShieldCheck, Mail, ArrowUpRight, Compass, Download, Eye, X, Info, MapPin, Phone, User, Printer, TrendingUp, Coins, ShoppingCart, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface OrderTrackerProps {
  orders: OrderState[];
  onProgressSimulation: (orderId: string) => void;
  onClearOrders: () => void;
}

const escapeCSV = (val: string | number | undefined | null) => {
  if (val === undefined || val === null) return '""';
  const stringVal = String(val);
  if (stringVal.includes('"') || stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('\r')) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return stringVal;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    let formattedDate = label;
    try {
      const d = new Date(label);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (e) {
      // fallback
    }

    return (
      <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl font-sans space-y-2 backdrop-blur-sm min-w-[200px]">
        <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider pb-1.5 border-b border-slate-800/80">
          {formattedDate}
        </div>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => {
            const isDaily = entry.name === 'Daily Sales';
            return (
              <div key={index} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span 
                    className="w-2 h-2 rounded-full inline-block" 
                    style={{ backgroundColor: entry.stroke || (isDaily ? '#10b981' : '#818cf8') }} 
                  />
                  <span>{entry.name}</span>
                </div>
                <span className={`font-mono font-bold ${isDaily ? 'text-emerald-400' : 'text-indigo-400'}`}>
                  KSh {new Intl.NumberFormat('en-KE').format(Number(entry.value))}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const OrderTracker: React.FC<OrderTrackerProps> = ({ orders, onProgressSimulation, onClearOrders }) => {
  if (orders.length === 0) return null;

  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderState | null>(null);
  const [orderToPrint, setOrderToPrint] = useState<OrderState | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (confirmClear) {
      const timer = setTimeout(() => {
        setConfirmClear(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [confirmClear]);

  // Process business metrics and chart trend points
  const performanceStats = React.useMemo(() => {
    const totalSales = orders.reduce((acc, current) => acc + current.total, 0);
    const orderCount = orders.length;
    const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0;
    const highestSaleValue = orders.reduce((max, current) => current.total > max ? current.total : max, 0);

    // Grouping sales by formatted date for clean trend metrics
    const dailyMap: { [date: string]: number } = {};
    orders.forEach(or => {
      const d = or.date;
      dailyMap[d] = (dailyMap[d] || 0) + or.total;
    });

    const sortedDates = Object.keys(dailyMap).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    let runningCumulativeTotal = 0;
    const chartPoints = sortedDates.map(date => {
      const dailyTotal = dailyMap[date];
      runningCumulativeTotal += dailyTotal;
      return {
        date,
        'Daily Sales': dailyTotal,
        'Cumulative Sales': runningCumulativeTotal
      };
    });

    return {
      totalSales,
      orderCount,
      averageOrderValue,
      highestSaleValue,
      chartPoints
    };
  }, [orders]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedOrderDetail(null);
        setOrderToPrint(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Automatically trigger web printing when an order is selected for printing
  useEffect(() => {
    if (orderToPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [orderToPrint]);

  const getItemUnitPrice = (item: CartItem) => {
    let price = item.product.price;
    if (item.product.customizableOptions) {
      item.product.customizableOptions.forEach(opt => {
        const match = opt.choices.find(c => c.value === item.selectedOptions[opt.name]);
        if (match) price += match.priceModifier;
      });
    }
    return price;
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-KE').format(p);
  };

  const handleEmailInvoice = (or: OrderState) => {
    const subject = `Tax Invoice & Hardware Order Dispatch Receipt [Order Ref: ${or.orderId}]`;
    
    let body = `========================================================\n`;
    body += `        VINCE INVESTMENTS & SOLUTIONS (EAST AFRICA)\n`;
    body += `             OFFICIAL ELECTRONIC TAX INVOICE\n`;
    body += `========================================================\n\n`;
    
    body += `Dear ${or.info.name},\n\n`;
    body += `Thank you for your recent business order. Please find below the detailed invoice reconciliation and hardware dispatch parameters for your reference:\n\n`;
    
    body += `1. LOGISTICS & TRANSACTION METADATA\n`;
    body += `--------------------------------------------------------\n`;
    body += `Order Reference ID : ${or.orderId}\n`;
    body += `Reconciliation Date: ${or.date}\n`;
    body += `Clearing Method    : ${or.info.paymentMethod.toUpperCase()}\n`;
    if (or.info.mpesaCode) {
      body += `M-PESA Reference ID: ${or.info.mpesaCode.toUpperCase()}\n`;
    }
    body += `Order Dispatch Stat: ${or.status.toUpperCase()}\n\n`;
    
    body += `2. CONSIGNEE & SHIPMENT ADDRESS DIRECTIVES\n`;
    body += `--------------------------------------------------------\n`;
    body += `Customer Name      : ${or.info.name}\n`;
    body += `Contact Email      : ${or.info.email}\n`;
    body += `Phone Contact Number: ${or.info.phone}\n`;
    body += `Target County      : ${or.info.county} County\n`;
    body += `Delivery Address   : ${or.info.address}\n`;
    body += `Logistics Standard : ${or.info.shippingMethod}\n\n`;
    
    body += `3. DISPATCHED PARTICULARS & CUSTOM SPECIFICATIONS\n`;
    body += `--------------------------------------------------------\n`;
    
    or.items.forEach((item, index) => {
      const unitPrice = getItemUnitPrice(item);
      const optionsStr = Object.entries(item.selectedOptions)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      
      body += `${index + 1}. Hardware Item: ${item.product.name}\n`;
      body += `   Manufacturer  : ${item.product.brand}\n`;
      if (optionsStr) {
        body += `   Config Options: ${optionsStr}\n`;
      }
      body += `   Quantity      : ${item.quantity}\n`;
      body += `   Retail Unit   : KSh ${formatPrice(unitPrice)}\n`;
      body += `   Total Sum     : KSh ${formatPrice(unitPrice * item.quantity)}\n`;
      body += `--------------------------------------------------------\n`;
    });
    
    body += `\n4. LEDGER RECONCILIATION SUMMARY\n`;
    body += `--------------------------------------------------------\n`;
    body += `Retail Hardware Subtotal : KSh ${formatPrice(or.subtotal)}\n`;
    if (or.couponUsed && or.discount > 0) {
      body += `Applied Coupon Discount  : - KSh ${formatPrice(or.discount)} [Code: ${or.couponUsed}]\n`;
    }
    body += `KRA Value-Added Tax (16%): KSh ${formatPrice(or.vat)}\n`;
    body += `Shipment & Escrow Cover  : KSh ${formatPrice(or.shippingPrice)}\n`;
    body += `--------------------------------------------------------\n`;
    body += `GRAND TOTAL AMOUNT PAID  : KSh ${formatPrice(or.total)}\n`;
    body += `========================================================\n\n`;
    
    body += `This invoice statement has been parsed and generated via Vince automated systems. If you have any inquiries regarding device diagnostic support or physical hardware replacement schedules under warranty, please let us know.\n\n`;
    body += `Thank you for your trust and continuous partnership.\n\n`;
    body += `Kind regards,\n`;
    body += `Authorized Account & Bookkeeper Manager\n`;
    body += `Vince Investments & Solutions Inc\n`;
    body += `Technical Representative: okothden99@gmail.com\n`;
    body += `========================================================`;

    const mailtoUrl = `mailto:${or.info.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Email',
      'Phone',
      'Shipping County',
      'Address',
      'Shipping Method',
      'Payment Method',
      'M-PESA / Wire Code',
      'Subtotal (KSh)',
      'VAT (16% KSh)',
      'Discount (KSh)',
      'Shipping Price (KSh)',
      'Total Price (KSh)',
      'Order Status',
      'Items Summary'
    ];

    const rows = orders.map(or => {
      const itemsSummary = or.items.map(item => {
        const optionsPart = Object.entries(item.selectedOptions)
          .map(([key, val]) => `${key}: ${val}`)
          .join('; ');
        return `${item.quantity}x ${item.product.name}${optionsPart ? ` (${optionsPart})` : ''}`;
      }).join(' | ');

      return [
        or.orderId,
        or.date,
        or.info.name,
        or.info.email,
        or.info.phone,
        or.info.county,
        or.info.address,
        or.info.shippingMethod,
        or.info.paymentMethod,
        or.info.mpesaCode || '',
        or.subtotal,
        or.vat,
        or.discount,
        or.shippingPrice,
        or.total,
        or.status,
        itemsSummary
      ].map(escapeCSV);
    });

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vince_orders_bookkeeping_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIndex = (status: OrderState['status']) => {
    const sequence: OrderState['status'][] = ['processing_payment', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    return sequence.indexOf(status);
  };

  const activeSteps = [
    { label: 'Secure Payment', desc: 'Verifying M-PESA/Wire Code', icon: ShieldCheck },
    { label: 'Processing', desc: 'Vince Warehouse Kisumu packing', icon: Box },
    { label: 'Shipped', desc: 'Left Kampala Street depot', icon: Truck },
    { label: 'Out for Delivery', desc: 'Moto courier dispatch is active', icon: Compass },
    { label: 'Delivered', desc: 'Arrived at destination client', icon: CheckCircle2 }
  ];

  return (
    <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest font-display">Live order flow</span>
          <h2 className="text-xl md:text-2xl font-display font-bold">Secure Delivery Status tracker</h2>
          <p className="text-xs text-slate-400 mt-1">Track and simulate logistics progress for your high-performance hardware orders.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="text-[11px] font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 border border-amber-600 rounded-xl px-3.5 py-1.5 transition-all text-xs flex items-center gap-1.5 shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Bookkeeping CSV</span>
          </button>
          <button
            onClick={() => {
              if (confirmClear) {
                onClearOrders();
                setConfirmClear(false);
              } else {
                setConfirmClear(true);
              }
            }}
            className={`text-[11px] font-semibold rounded-xl px-3 py-1.5 transition-all text-xs cursor-pointer ${
              confirmClear
                ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-600 hover:scale-105 shadow-md animate-pulse'
                : 'text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 hover:-translate-y-0.5 border border-slate-800'
            }`}
          >
            {confirmClear ? 'Double-click to Confirm' : 'Clear History Cache'}
          </button>
        </div>
      </div>

      {/* Visual Business Performance & Revenue Trend Panel utilizing Recharts */}
      <div className="bg-slate-950/60 p-5 md:p-6 rounded-2xl border border-slate-800/80 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-mono tracking-widest uppercase font-black text-slate-400">Vince Business Hub</span>
            </div>
            <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
              <span>Transactional Performance Analytics</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
                Real-Time Trend
              </span>
            </h3>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Showing trends compiled across {performanceStats.orderCount} cleared customer operations
          </div>
        </div>

        {/* Dynamic Metric KPIs cards block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 space-y-1 shadow">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Sales Volume</span>
              <Coins className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-lg font-black font-mono text-emerald-400">KSh {formatPrice(performanceStats.totalSales)}</p>
            <p className="text-[9px] text-slate-500 leading-none">Gross aggregate receipts in ledger</p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 space-y-1 shadow">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Order Count</span>
              <ShoppingCart className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <p className="text-lg font-black font-mono text-indigo-300">{performanceStats.orderCount}</p>
            <p className="text-[9px] text-slate-500 leading-none">Completed logistics operations</p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 space-y-1 shadow">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Average Order size</span>
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-lg font-black font-mono text-amber-400">KSh {formatPrice(performanceStats.averageOrderValue)}</p>
            <p className="text-[9px] text-slate-500 leading-none">Representative unit margin average</p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 space-y-1 shadow">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Highest Invoice</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-lg font-black font-mono text-slate-100">KSh {formatPrice(performanceStats.highestSaleValue)}</p>
            <p className="text-[9px] text-slate-500 leading-none">Peak transaction cleared today</p>
          </div>
        </div>

        {/* Recharts Graphical Trend Container */}
        <div className="bg-slate-950/40 p-3 pt-4 border border-slate-800/50 rounded-xl">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={performanceStats.chartPoints}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSalesCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSalesDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `KSh ${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="Cumulative Sales" 
                  stroke="#818cf8" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSalesCumulative)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Daily Sales" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSalesDaily)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-sans tracking-wide mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Daily Total Sales Volume</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
              <span>Cumulative Portfolio Growth</span>
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-8 divide-y divide-slate-800/60">
        {orders.map((or, idx) => {
          const currentStageIdx = getStatusIndex(or.status);

          return (
            <div key={or.orderId} className={`pt-6 ${idx === 0 ? 'pt-0' : 'pt-6'} space-y-6`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/40 text-xs hover:border-slate-700 transition-all">
                <div 
                  onClick={() => setSelectedOrderDetail(or)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 cursor-pointer group hover:bg-slate-900/40 p-2 rounded-xl transition-colors"
                  title="Click to view full receipt & address details"
                >
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider group-hover:text-amber-500 transition-colors">Order Reference ID</span>
                    <strong className="text-slate-200 text-sm font-mono font-bold tracking-wide text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                      {or.orderId}
                      <Eye className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider group-hover:text-slate-300 transition-colors">Order Date</span>
                    <span className="text-slate-300 font-medium">{or.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider group-hover:text-slate-300 transition-colors">Recipient Name</span>
                    <span className="text-slate-300 font-semibold">{or.info.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider group-hover:text-slate-300 transition-colors">Total Invoice Co.</span>
                    <span className="text-slate-100 font-bold font-mono group-hover:text-white transition-colors">KSh {formatPrice(or.total)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedOrderDetail(or)}
                    className="px-3 py-2 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all flex items-center gap-1.5 shadow cursor-pointer mr-0.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOrderToPrint(or);
                    }}
                    className="px-3 py-2 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 border border-slate-700 hover:border-slate-600 rounded-xl transition-all flex items-center gap-1.5 shadow cursor-pointer mr-0.5"
                    title="Print Specific Order Invoice Summary"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-500" />
                    <span>Print Invoice</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEmailInvoice(or);
                    }}
                    className="px-3 py-2 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-indigo-400 border border-slate-700 hover:border-slate-600 rounded-xl transition-all flex items-center gap-1.5 shadow cursor-pointer mr-0.5"
                    title="Email Invoice Summary to Client"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#818cf8]" />
                    <span>Email PDF</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onProgressSimulation(or.orderId);
                    }}
                    disabled={or.status === 'delivered'}
                    className={`px-4 py-2 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 shadow ${
                      or.status === 'delivered'
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-[1.01] active:stroke-slate-50 cursor-pointer'
                    }`}
                  >
                    <span>Simulate Shipment Progress</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>


                </div>
              </div>

              {/* Items checklist line summary */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pl-1 font-medium">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px] mr-1.5">Hardware Dispatch:</span>
                {or.items.map((item, id) => (
                  <span key={id} className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                    {item.quantity}x {item.product.name}
                  </span>
                ))}
              </div>

              {/* Interactive track stepper bar */}
              <div className="relative pt-2">
                <div className="hidden md:flex justify-between relative z-10">
                  {activeSteps.map((stepItem, sIdx) => {
                    const StepIcon = stepItem.icon;
                    const isPassed = sIdx < currentStageIdx;
                    const isCurrent = sIdx === currentStageIdx;

                    return (
                      <div key={sIdx} className="flex flex-col items-center text-center w-1/5 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isPassed
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-amber-500 text-slate-950 scale-110 shadow-lg ring-4 ring-amber-500/20'
                            : 'bg-slate-800 text-slate-600 border border-slate-700'
                        }`}>
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <h4 className={`text-xs font-bold mt-2.5 tracking-tight ${
                          isCurrent ? 'text-amber-400 font-display' : isPassed ? 'text-emerald-500' : 'text-slate-500'
                        }`}>
                          {stepItem.label}
                        </h4>
                        <p className="text-[9px] text-slate-500 max-w-[120px] mt-0.5 leading-tight">
                          {stepItem.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile list view for tracking steps */}
                <div className="block md:hidden space-y-3.5 pl-2">
                  {activeSteps.map((stepItem, sIdx) => {
                    const StepIcon = stepItem.icon;
                    const isPassed = sIdx < currentStageIdx;
                    const isCurrent = sIdx === currentStageIdx;

                    return (
                      <div key={sIdx} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isPassed
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                            : 'bg-slate-800 text-slate-600 border border-slate-700'
                        }`}>
                          <StepIcon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold tracking-tight ${
                            isCurrent ? 'text-amber-400' : isPassed ? 'text-emerald-500' : 'text-slate-500'
                          }`}>
                            {stepItem.label}
                          </h4>
                          <span className="text-[10px] text-slate-500 block leading-tight">
                            {stepItem.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stepper progress track bar line behind */}
                <div className="absolute top-[21px] left-[10%] right-[10%] h-1 bg-slate-800 z-0 hidden md:block rounded-full">
                  <div
                    className="h-1 bg-gradient-to-r from-emerald-600 to-amber-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${(currentStageIdx / (activeSteps.length - 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Details Modal Overlay */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-slate-900 border border-slate-800 text-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-950 p-5 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Order Booking Receipt</span>
                <h3 className="text-md font-display font-bold text-slate-100 flex items-center gap-2">
                  <span>Reference ID:</span>
                  <span className="font-mono text-amber-400 font-bold tracking-wider">{selectedOrderDetail.orderId}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                title="Close Modal (or Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto text-xs leading-relaxed">
              
              {/* Order Metadata and Status banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 font-medium font-sans">
                <div>
                  <span className="text-slate-500 block uppercase text-[9px] tracking-wider font-bold">Booking Date</span>
                  <p className="text-slate-300 font-mono text-[11px]">{selectedOrderDetail.date}</p>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[9px] tracking-wider font-bold text-right sm:text-right">State Flow Indicator</span>
                  <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mt-0.5">
                    {selectedOrderDetail.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Profiles & Logistics Info Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                
                {/* Profile Box */}
                <div className="bg-slate-950/20 p-4 rounded-xl border border-slate-800/40 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    <span>Recipient Contact</span>
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Name</span>
                      <span className="text-slate-200 font-bold">{selectedOrderDetail.info.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Email</span>
                      <span className="text-slate-300 font-medium ">{selectedOrderDetail.info.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Contact Mobile</span>
                      <span className="text-slate-300 font-mono font-medium">{selectedOrderDetail.info.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping & Delivery Box */}
                <div className="bg-slate-950/20 p-4 rounded-xl border border-slate-800/40 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>Delivery Address Fact</span>
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Shipping Destination County</span>
                      <span className="text-slate-200 font-bold">{selectedOrderDetail.info.county} County</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Full physical address</span>
                      <span className="text-slate-300 font-semibold leading-normal">{selectedOrderDetail.info.address}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold bg-slate-800/80 border border-slate-700/50 px-2 py-0.5 rounded text-[10px] uppercase mt-0.5 inline-block">
                        {selectedOrderDetail.info.shippingMethod} delivery
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Secure Payment details box */}
              <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/60 space-y-2 text-left">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Clearing & Bookkeeping Info</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Payment Mode Chosen</span>
                    <span className="text-slate-200 font-bold uppercase text-[11px]">{selectedOrderDetail.info.paymentMethod}</span>
                  </div>
                  {selectedOrderDetail.info.paymentMethod === 'mpesa' && (
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">M-PESA Code verified</span>
                      <span className="text-emerald-400 font-mono font-bold text-xs tracking-widest bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/20 rounded inline-block">
                        {selectedOrderDetail.info.mpesaCode || 'PENDING'}
                      </span>
                    </div>
                  )}
                  {selectedOrderDetail.info.paymentMethod === 'stripe' && (
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Stripe Payment Verification</span>
                      <span className="text-indigo-400 font-mono font-bold text-xs bg-indigo-500/10 px-2.5 py-0.5 border border-indigo-500/20 rounded inline-block">
                        {selectedOrderDetail.info.stripePaymentId || 'Verified Sandbox Account'}
                      </span>
                    </div>
                  )}
                  {selectedOrderDetail.info.paymentMethod === 'bank' && (
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Bank Wire Reference Code</span>
                      <span className="text-sky-400 font-mono font-bold text-xs tracking-wider bg-sky-500/10 px-2.5 py-0.5 border border-sky-500/20 rounded inline-block">
                        {selectedOrderDetail.info.mpesaCode || 'PROCESSING'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Itemized Lists breakdown */}
              <div className="space-y-3 text-left">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Purchased Hardware Details</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
                  {selectedOrderDetail.items.map((item, keyIdx) => {
                    const unitPrice = getItemUnitPrice(item);
                    return (
                      <div key={keyIdx} className="bg-slate-950/10 p-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="flex gap-3">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="bg-slate-950/40 w-11 h-11 object-contain p-1 rounded-lg border border-slate-800/80 shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-slate-200 font-semibold">{item.product.name}</span>
                            <div className="text-[10px] text-slate-500 mt-0.5 flex flex-wrap gap-1.5 font-mono">
                              <span>Brand: {item.product.brand}</span>
                              {Object.entries(item.selectedOptions).map(([optName, optVal]) => (
                                <span key={optName} className="bg-slate-800/60 text-slate-400 px-1.5 py-0.5 rounded text-[9px]">
                                  {optName}: {optVal}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between sm:justify-end items-center gap-6 text-right font-mono">
                          <div className="text-[11px] text-slate-400">
                            Quantity: <span className="font-bold text-slate-200">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block font-sans">Line Sub</span>
                            <span className="text-slate-200 font-semibold font-mono">KSh {formatPrice(unitPrice * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Invoice calculation receipt */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 text-left font-sans">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Retail Hardware Subtotal:</span>
                  <span className="font-mono text-slate-300 font-semibold">KSh {formatPrice(selectedOrderDetail.subtotal)}</span>
                </div>
                {selectedOrderDetail.couponUsed && selectedOrderDetail.discount > 0 && (
                  <div className="flex justify-between font-medium text-emerald-500/90 text-[11px]">
                    <span>Discount applied ({selectedOrderDetail.couponUsed}):</span>
                    <span className="font-mono">- KSh {formatPrice(selectedOrderDetail.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-[11px]">
                  <span className="text-slate-500">KRA Value-Added Tax (16% VAT):</span>
                  <span className="font-mono text-slate-400 font-semibold">KSh {formatPrice(selectedOrderDetail.vat)}</span>
                </div>
                <div className="flex justify-between font-medium text-[11px]">
                  <span className="text-slate-500">County Delivery & Custody Protection:</span>
                  <span className="font-mono text-slate-400 font-semibold">KSh {formatPrice(selectedOrderDetail.shippingPrice)}</span>
                </div>
                <div className="border-t border-slate-800/80 pt-2.5 mt-1 flex justify-between items-center text-left">
                  <span className="text-slate-200 font-bold uppercase font-display tracking-wide text-xs">Total Ledger Invoiced</span>
                  <span className="text-[16px] font-bold font-mono text-amber-400">KSh {formatPrice(selectedOrderDetail.total)}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer actions */}
            <div className="bg-slate-950/80 p-4 border-t border-slate-800/80 flex items-center justify-between gap-3 flex-wrap font-sans">
              <span className="text-[9px] text-slate-500 uppercase font-mono tracking-widest font-bold">Vince Solutions Bookkeeping</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setOrderToPrint(selectedOrderDetail)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg transition-all border border-amber-700 cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => selectedOrderDetail && handleEmailInvoice(selectedOrderDetail)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all border border-indigo-700 cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email PDF</span>
                </button>
                <button
                  onClick={() => setSelectedOrderDetail(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all border border-slate-700 cursor-pointer hover:text-white"
                >
                  Close Receipt Window
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Portal Printable Invoice */}
      {orderToPrint && createPortal(
        <div id="print-invoice-section" className="p-4 md:p-8 space-y-6">
          {/* Action header, visible ONLY on browser screen display, auto-hidden at print-time */}
          <div className="no-print max-w-4xl mx-auto mb-6 p-4 bg-slate-100 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-850">Invoice Sheet Manager is Active (Print Mode triggered automatically)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl cursor-pointer shadow duration-150 transform hover:scale-102 active:scale-98"
              >
                Trigger System Print Again
              </button>
              <button
                onClick={() => setOrderToPrint(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl cursor-pointer duration-150"
              >
                Close Paper Preview
              </button>
            </div>
          </div>

          {/* Clean printable invoice paper template */}
          <div className="print-card-border bg-white text-black max-w-4xl mx-auto rounded-2xl shadow-xl p-8 md:p-12 space-y-8 font-sans border border-slate-250">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight text-slate-900 font-display">VINCE INVESTMENTS & SOLUTIONS</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">Enterprise Hardware Solutions Provider & Reseller</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Kampala Street, Kisumu, Kenya</p>
                <p className="text-[11px] text-slate-400">Representative: okothden99@gmail.com</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">OFFICIAL TAX INVOICE</span>
                <strong className="text-md md:text-lg font-mono font-bold tracking-wider text-slate-900 block mt-1">Ref ID: {orderToPrint.orderId}</strong>
                <span className="text-xs text-slate-500 block font-medium mt-0.5">{orderToPrint.date}</span>
              </div>
            </div>

            {/* Recipient Logistics info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Billed Customer / Consigned To:</span>
                <div className="font-extrabold text-slate-950 text-sm">{orderToPrint.info.name}</div>
                <div className="text-slate-600 font-medium">Email: {orderToPrint.info.email}</div>
                <div className="text-slate-600 font-medium">Phone: {orderToPrint.info.phone}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Delivery Destination Logistics:</span>
                <div className="font-extrabold text-slate-950 text-sm">{orderToPrint.info.county} County</div>
                <div className="text-slate-600 font-medium">Address: {orderToPrint.info.address}</div>
                <div className="text-slate-600 font-medium">Delivery Mode: <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold text-[9px] uppercase">{orderToPrint.info.shippingMethod}</span></div>
              </div>
            </div>

            {/* Transaction Verification status code block */}
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block">Clearing Payment Channel</span>
                <strong className="text-slate-900 text-xs font-bold uppercase block mt-0.5">{orderToPrint.info.paymentMethod} Authorization</strong>
              </div>
              {(orderToPrint.info.mpesaCode || orderToPrint.info.stripePaymentId) && (
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block">Clearing Verification ID</span>
                  <strong className="text-slate-950 font-mono font-extrabold text-xs tracking-wide block mt-0.5 uppercase">
                    {orderToPrint.info.paymentMethod === 'stripe' ? orderToPrint.info.stripePaymentId : orderToPrint.info.mpesaCode}
                  </strong>
                </div>
              )}
            </div>

            {/* Detailed item list particulars table */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Dispatched Particulars Balance</span>
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold">
                    <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Description & Customizations</th>
                    <th className="py-2.5 text-center font-bold uppercase tracking-wider text-[10px] w-20">Quantity</th>
                    <th className="py-2.5 text-right font-bold uppercase tracking-wider text-[10px] w-32">Unit Rate</th>
                    <th className="py-2.5 text-right font-bold uppercase tracking-wider text-[10px] w-36">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orderToPrint.items.map((item, keyIdx) => {
                    const unitPrice = getItemUnitPrice(item);
                    return (
                      <tr key={keyIdx} className="text-slate-800">
                        <td className="py-3">
                          <div className="font-extrabold text-slate-900 text-xs">{item.product.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                            Brand: {item.product.brand}
                            {Object.entries(item.selectedOptions).length > 0 && (
                              <span className="ml-2 font-mono text-slate-500">
                                ({Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ')})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-center font-extrabold font-mono text-slate-900">{item.quantity}</td>
                        <td className="py-3 text-right font-mono text-slate-500">KSh {formatPrice(unitPrice)}</td>
                        <td className="py-3 text-right font-mono font-extrabold text-slate-900 text-xs">KSh {formatPrice(unitPrice * item.quantity)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Ledger Financial computations */}
            <div className="border-t border-slate-200 pt-6 flex justify-end">
              <div className="w-80 space-y-2.5 text-xs text-right">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Retail Hardware Subtotal:</span>
                  <span className="font-mono text-slate-800 font-semibold">KSh {formatPrice(orderToPrint.subtotal)}</span>
                </div>
                {orderToPrint.couponUsed && orderToPrint.discount > 0 && (
                  <div className="flex justify-between font-medium text-emerald-600">
                    <span>Discount Code Applied ({orderToPrint.couponUsed}):</span>
                    <span className="font-mono font-bold">- KSh {formatPrice(orderToPrint.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">KRA Value-Added Tax (16% VAT):</span>
                  <span className="font-mono text-slate-800 font-semibold">KSh {formatPrice(orderToPrint.vat)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Delivery & Protected Escrow Cover:</span>
                  <span className="font-mono text-slate-800 font-semibold">KSh {formatPrice(orderToPrint.shippingPrice)}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm">
                  <span className="font-extrabold uppercase tracking-wide text-slate-900 text-xs">Total Invoiced Amount:</span>
                  <span className="text-md font-extrabold font-mono text-indigo-950">KSh {formatPrice(orderToPrint.total)}</span>
                </div>
              </div>
            </div>

            {/* Invoice Sign-off / Bookkeeper credit */}
            <div className="border-t border-slate-200 pt-6 text-center space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none">Thank you for choosing Vince Investments as your corporate hardware partner</p>
              <p className="text-[9px] text-slate-400 leading-normal">System generated electronic invoice representation. Fully reconciled with state storage cache.</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
