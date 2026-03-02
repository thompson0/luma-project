'use client';

import HomeGreeting from '@/components/home/HomeGreeting';
import HomeStats from '@/components/home/HomeStats';
import QuickAccess from '@/components/home/QuickAccess';
import AlertsAndActions from '@/components/home/AlertsAndActions';
import HomeFooter from '@/components/home/HomeFooter';

export default function Home() {
	return (
		<main className="min-h-screen bg-background">
			<HomeGreeting />
			<HomeStats />
			<QuickAccess />
			<AlertsAndActions />
			<HomeFooter />
		</main>
	);
}

