"use client"

import React, {useState} from 'react';
import {motion, AnimatePresence, Variants} from "framer-motion";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_white} from "@/styles/color";
import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";

const Filter = () => {
    const data: { category: string, title: string }[] = [
        {
            category: "car",
            title: "BMW"
        },
        {
            category: "car",
            title: "BMW"
        }, {
            category: "car",
            title: "BMW"
        },
        {
            category: "cars1",
            title: "BMW1"
        },
        {
            category: "cars1",
            title: "BMW1"
        },
        {
            category: "cars1",
            title: "BMW1"
        },
        {
            category: "cars2",
            title: "BMW2"
        },
        {
            category: "cars2",
            title: "BMW2"
        },
        {
            category: "cars2",
            title: "BMW2"
        },
        {
            category: "cars3",
            title: "BMW3"
        },
        {
            category: "cars3",
            title: "BMW3"
        },
        {
            category: "cars3",
            title: "BMW3"
        }
    ]

    const [selectedCategory, setSelectedCategory] = useState(data.filter(item => item.category === 'car'))

    const buttons = data.reduce((acc: string[], item) => {
        if (acc.includes(item.category)) return acc;
        return [...acc, item.category];
    }, []);

    const categoryHandler = (category: string) => {
        console.log(category)
        setSelectedCategory(data.filter(item => item.category === category))
    }

    const variants: Variants = {
        'initial': {
            height: 0,
            opacity: 0
        },
        'animate': {
            height: 'auto',
            opacity: 1
        },
        'exit': {
            height: 0,
            opacity: 0
        }
    }

    return (
        <div>
            <motion.div
                style={{display: "flex"}}
            >
                {
                    buttons.map(btn => (
                        <Button style={{backgroundColor: color_1, textColor: color_white}}
                                onClick={() => categoryHandler(btn)} key={`key=${btn}`}>{btn}</Button>
                    ))
                }
            </motion.div>

            <AnimatePresence initial={false}>
                {selectedCategory.map((item, index) => (
                    <div key={`key=${item.category}${index}`}>
                        <motion.div
                            variants={variants}
                            initial={"initial"}
                            animate={"animate"}
                            exit={"exit"}
                            style={{overflow: "hidden"}}
                        >
                            <MainShadow>
                                <div style={{padding: "10px 20px"}}>{item.title}</div>
                            </MainShadow>
                        </motion.div>
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Filter;