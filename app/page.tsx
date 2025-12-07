'use client';

import ProductList from "@/src/products/ProductList";

export default function Home() {
    
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
               
                
                <ProductList /> 
            </div>
        </main>
    );
}