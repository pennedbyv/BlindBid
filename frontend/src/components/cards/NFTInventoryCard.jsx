import React from 'react';
import { motion } from 'framer-motion';

export default function NFTInventoryCard({ nft, onAdd }) {
  const { name, collection, rarity, price, change, isPositive, image } = nft;

  return (
    <motion.div
      whileHover={{ scale: 1.01, translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onAdd && onAdd(nft)}
      className="group bg-charcoal-card rounded-2xl p-4 border border-white/5 hover:border-secondary/30 transition-all duration-300 cursor-grab active:cursor-grabbing flex flex-col"
    >
      <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          alt={name}
          src={image}
        />
        {rarity && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-mono text-secondary uppercase">
            {rarity}
          </div>
        )}
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-label text-label-md text-white group-hover:text-secondary transition-colors font-medium">
            {name}
          </h3>
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter">
            {collection}
          </p>
        </div>
        <div className="text-right">
          <span className="font-label text-label-md text-white font-medium">{price}</span>
          {change && (
            <p className={`font-mono text-[10px] ${
              isPositive === true ? 'text-emerald-500' :
              isPositive === false ? 'text-red-500' : 'text-on-surface-variant'
            }`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
