'use client';
import React from 'react';
import { useState } from 'react';

export default function ControlCards({ title }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-2">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
        </div>
    );

}