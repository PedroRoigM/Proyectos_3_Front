'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import GetAdvisors from '../../components/lib/GetAdvisors';
import GetDegrees from '../../components/lib/GetDegrees';
import GetYears from '../../components/lib/GetYears';
import ControlCards from '../../components/ControlCard';
export default function ControlPanel() {
    const [advisors, setAdvisors] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [years, setYears] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const advisorsData = await GetAdvisors();
                const degreesData = await GetDegrees();
                const yearsData = await GetYears();

                setAdvisors(advisorsData);
                setDegrees(degreesData);
                setYears(yearsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Control Panel</h1>

            <section className="mb-8 w-full">
                <h2 className="text-2xl font-semibold mb-2">Advisors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {advisors.map((advisor, index) => (
                        <ControlCards
                            key={index}
                            title={advisor.advisor}
                            data={advisors}
                            type="advisor"
                        />
                    ))}
                </div>
            </section>

            <section className="mb-8 w-full">
                <h2 className="text-2xl font-semibold mb-2">Degrees</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {degrees.map((degree, index) => (
                        <ControlCards
                            key={index}
                            title={degree.degree}
                            data={degrees}
                            type="degree"
                        />
                    ))}
                </div>
            </section>

            <section className="w-full">
                <h2 className="text-2xl font-semibold mb-2">Years</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {years.map((year, index) => (
                        <ControlCards
                            key={index}
                            title={year.year}
                            data={years}
                            type="year"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
