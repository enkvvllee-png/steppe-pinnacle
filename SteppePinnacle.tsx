import React from 'react';
import { motion } from 'framer-motion';

// Define the props for the component using TypeScript types
interface SteppePinnacleProps {
    title: string;
    description: string;
    imageUrl: string;
}

const SteppePinnacle: React.FC<SteppePinnacleProps> = ({ title, description, imageUrl }) => {
    return (
        <motion.div 
            className="steppe-pinnacle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            role="region" 
            aria-labelledby="steppe-title"
        >
            <h1 id="steppe-title">{title}</h1>
            <img src={imageUrl} alt={description} loading="lazy" />
            <p>{description}</p>
        </motion.div>
    );
};

export default SteppePinnacle;
