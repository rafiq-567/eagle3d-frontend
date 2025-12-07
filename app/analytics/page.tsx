
'use client';

import React, { useMemo } from 'react';

import { useGetProductsQuery } from '../../src/services/productApi';
import { DollarSign, Package, TrendingUp, XCircle, Loader2 } from 'lucide-react';

import { Product } from '../../src/types/shared.types';


const Card = ({ children, className = '' }) => (
    <div className={`rounded-xl border bg-white shadow-sm dark:bg-gray-800 ${className}`}>
        {children}
    </div>
);
const CardHeader = ({ children, className = '' }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className = '' }) => (
    <h3 className={`font-semibold tracking-tight text-xl text-gray-900 dark:text-white ${className}`}>
        {children}
    </h3>
);
const CardDescription = ({ children, className = '' }) => (
    <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>{children}</p>
);
const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);


interface ChartData {
    [key: string]: string | number;
}

interface ChartProps {
    data: ChartData[];
    index: string;
    categories: string[];
    colors: string[];
    valueFormatter: (value: number) => string;
    yAxisLabel: string;
    className?: string;
}


const BarChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className = '' }) => {
    if (!data || data.length === 0) return <div className="text-center py-10 text-gray-500">No chart data.</div>;

    const categoryKey = categories[0];
    const maxValue = Math.max(...data.map(item => item[categoryKey] as number)) || 1;

    const colorMap: { [key: string]: string } = {
        '#3b82f6': 'bg-blue-600',
        '#10b981': 'bg-green-500',
        '#f87171': 'bg-red-500',
    };
    const barColor = colorMap[colors[0]] || 'bg-indigo-600';

    return (
        <div className={`space-y-4 ${className}`}>
            {data.map((item, i) => {
                const value = item[categoryKey] as number;
                const percentage = (value / maxValue) * 100;

                return (
                    <div key={i} className="flex items-center space-x-3">

                        <div className="w-24 text-sm text-gray-600 dark:text-gray-300 font-medium truncate">
                            {item[index]}
                        </div>

                        <div className="flex-1 flex items-center">
                            <div
                                style={{ width: `${percentage}%`, minWidth: '4px' }}
                                className={`h-8 ${barColor} rounded-sm transition-all duration-500`}
                            />
                            <span className="ml-3 text-sm font-bold text-gray-800 dark:text-white">
                                {valueFormatter(value)}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};



const LineChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className = '' }) => {
    if (!data || data.length < 2) return <div className="text-center py-10 text-gray-500">Need more data for line chart.</div>;

    const categoryKey = categories[0];
    const values = data.map(item => item[categoryKey] as number);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);


    const points = values.map((val, i) => {
        const x = (i / (values.length - 1)) * 100;
        let y = 100;
        if (maxVal > minVal) {
            y = 100 - ((val - minVal) / (maxVal - minVal)) * 100;
        } else if (maxVal === 0) {
            y = 100;
        } else {
            y = 50;
        }
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');

    const lineColor = colors[0] || '#8b5cf6';

    return (
        <div className={`relative h-64 w-full ${className}`}>

            <div className="absolute inset-0 border-y border-dashed border-gray-300 dark:border-gray-700">
                <div className="absolute top-1/2 w-full border-b border-dashed border-gray-300 dark:border-gray-700"></div>
            </div>


            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full absolute" style={{ padding: '10px 0' }}>
                <polyline
                    fill="none"
                    stroke={lineColor}
                    strokeWidth="2"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: 'all 0.5s ease-out' }}
                />
            </svg>


            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-600 dark:text-gray-400 font-medium">

                {data.map((item, i) => (
                    <span key={i} className="text-center w-1/5 pt-2 text-sm">{item[index]}</span>
                ))}
            </div>
        </div>
    );
};



interface AnalyticsData {
    totalValue: number;
    totalStock: number;
    availableCount: number;
    discontinuedCount: number;
    stockValueByStatus: { name: string; value: number }[];
    priceDistribution: { priceRange: string; count: number }[];
    monthlyProductFlow: { month: string; added: number }[];
    totalProducts: number;
}

const aggregateData = (products: Product[]): AnalyticsData => {
    let totalValue = 0;
    let totalStock = 0;
    let availableCount = 0;
    let discontinuedCount = 0;

    const stockValueByStatus: { [key: string]: number } = { Available: 0, Discontinued: 0 };
    const priceRangeCounts: { [key: string]: number } = {};


    const mockMonthlyFlow = [
        { month: 'January', added: 10 },
        { month: 'February', added: 15 },
        { month: 'March', added: 8 },
        { month: 'April', added: 22 },
        { month: 'May', added: 14 },
    ];
    let totalProducts = products.length;

    products.forEach(product => {

        const price = product.price || 0;
        const stock = product.stock || 0;

        const value = price * stock;
        totalValue += value;
        totalStock += stock;


        const status = product.status;
        if (status === 'Available') {
            availableCount++;
        } else if (status === 'Discontinued') {
            discontinuedCount++;
        }

        const statusKey = status === 'Available' ? 'Available' : 'Discontinued';
        stockValueByStatus[statusKey] = (stockValueByStatus[statusKey] || 0) + value;


        let range;
        if (price < 100) range = '$0-100';
        else if (price < 500) range = '$100-500';
        else if (price < 1000) range = '$500-1K';
        else if (price < 5000) range = '$1K-5K';
        else range = '$5K+';

        priceRangeCounts[range] = (priceRangeCounts[range] || 0) + 1;
    });


    const orderedRanges = ['$0-100', '$100-500', '$500-1K', '$1K-5K', '$5K+'];
    const priceDistribution = orderedRanges
        .map(range => ({
            priceRange: range,
            count: priceRangeCounts[range] || 0
        }))
        .filter(item => item.count > 0);


    return {
        totalValue: totalValue,
        totalStock: totalStock,
        availableCount: availableCount,
        discontinuedCount: discontinuedCount,
        totalProducts: totalProducts,
        stockValueByStatus: Object.keys(stockValueByStatus).map(status => ({
            name: status,
            value: stockValueByStatus[status]
        })).filter(item => item.value > 0),
        priceDistribution,
        monthlyProductFlow: mockMonthlyFlow,
    };
};



export default function AnalyticsPage() {

    const { data: products, isLoading, isError } = useGetProductsQuery();

    const analytics = useMemo(() => {

        return aggregateData(products || []);
    }, [products]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[500px]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <span className="ml-3 text-lg text-gray-600">Loading analytical data...</span>
            </div>
        );
    }

    if (isError || !products) {
        return (
            <div className="text-red-500 p-6 border border-red-200 rounded-lg max-w-xl mx-auto mt-10 flex items-center">
                <XCircle className="h-6 w-6 mr-3" />
                Failed to load data.
                $\text{API}$ connection or server $\text{status}$ check out

            </div>
        );
    }

    // Format BDT in millions/thousands
    const formatCurrency = (amount: number): string => {
        if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
        return `$${amount.toFixed(0)}`;
    };

    return (
        <div className="p-4 md:p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white border-b pb-2">Dashboard Analytics (Analytics)</h1>
            <CardDescription className="text-lg">Real-time analysis of product inventory and stock.
            </CardDescription>

            {/* Kicker Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-xl transition duration-300 border-l-4 border-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total inventory value</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(analytics.totalValue)}</div>
                        <p className="text-xs text-muted-foreground pt-1">Current market price of all products
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-xl transition duration-300 border-l-4 border-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total stock number</CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalStock.toLocaleString('bn-BD')} </div>
                        <p className="text-xs text-muted-foreground pt-1">Toatl product in warehouse</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-xl transition duration-300 border-l-4 border-indigo-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Available for sale
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.availableCount} </div>
                        <p className="text-xs text-muted-foreground pt-1">{analytics.totalProducts > 0 ? ((analytics.availableCount / analytics.totalProducts) * 100).toFixed(1) : 0}% Total Product</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-xl transition duration-300 border-l-4 border-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Closed/Discontinued</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.discontinuedCount} </div>
                        <p className="text-xs text-muted-foreground pt-1">Unavailable products for sale
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Chart 1: Price Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product price distribution
                        </CardTitle>
                        <CardDescription>Number of products in different price ranges.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <BarChart
                            data={analytics.priceDistribution}
                            index="priceRange"
                            categories={['count']}
                            colors={['#3b82f6']} // Blue
                            valueFormatter={(value) => `${value} product`}
                            yAxisLabel="Number of product"
                            className="p-4"
                        />
                    </CardContent>
                </Card>

                {/* Chart 2: Inventory Value by Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Inventory value by status
                        </CardTitle>
                        <CardDescription>Total value of available vs. closed products.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <BarChart
                            data={analytics.stockValueByStatus}
                            index="name"
                            categories={['value']}
                            colors={['#10b981', '#f87171']} // Green, Red
                            valueFormatter={formatCurrency}
                            yAxisLabel="Total price ($)"
                            className="p-4"
                        />
                    </CardContent>
                </Card>

                {/* Chart 3: Product Flow Over Time (Mock Data) */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Trend of new products being added
                            (monthly)</CardTitle>
                        <CardDescription>Number of products added in the last few months.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-96">
                        <LineChart
                            data={analytics.monthlyProductFlow}
                            index="month"
                            categories={['added']}
                            colors={['#8b5cf6']} // Indigo
                            valueFormatter={(value) => `${value} product`}
                            yAxisLabel="added product"
                            className="p-4"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}