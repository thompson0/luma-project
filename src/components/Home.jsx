'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSecureFetch } from '@/hooks/useSecureFetch';
import { useRefresh } from '@/context/RefreshContext';
import {
	LayoutDashboard,
	Package,
	TrendingUp,
	Clock,
	User,
	LogOut,
	Zap,
	AlertCircle,
	CheckCircle2,
	ArrowRight,
} from 'lucide-react';

const navigationItems = [
	{
		title: 'Estoque e peças',
		description: 'Gerencie cadastros, lotes e reposições de produtos.',
		href: '/catalogo',
		icon: Package,
		color: 'from-blue-500 to-cyan-500',
	},	
	{
		title: 'Usuarios',
		description: 'Gerenciar contatos, histórico e preferências.',
		href: '/users',
		icon: User,
		color: 'from-pink-500 to-rose-500',
	},
];

function StatsCard({ icon: Icon, label, loading = false }) {
	return (
		<div className="overflow-hidden rounded-lg border border-border bg-card">
			<div className="p-6">
				<div className="flex items-start justify-between">
					<div className="space-y-2 flex-1">
						<p className="text-sm font-medium text-muted-foreground">{label}</p>
						{loading ? (
							<div className="h-8 w-24 animate-pulse rounded bg-muted" />
						) : (
							<p className="text-3xl font-bold">—</p>
						)}
					</div>
					<div className="rounded-lg bg-muted p-2.5">
						<Icon className="h-5 w-5 text-muted-foreground" />
					</div>
				</div>
			</div>
		</div>
	);
}

function AlertItem({ title, description, variant = 'default' }) {
	const isWarning = variant === 'warning';
	const isSuccess = variant === 'success';

	return (
		<div
			className={`rounded-lg border p-4 ${
				isWarning
					? 'border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-900/10'
					: isSuccess
						? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10'
						: 'border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10'
			}`}
		>
			<div className="flex gap-3">
				<div className="flex-shrink-0 mt-0.5">
					{isSuccess ? (
						<CheckCircle2
							className={`h-5 w-5 ${
								isSuccess
									? 'text-emerald-600 dark:text-emerald-400'
									: 'text-blue-600 dark:text-blue-400'
							}`}
						/>
					) : (
						<AlertCircle
							className={`h-5 w-5 ${
								isWarning
									? 'text-yellow-600 dark:text-yellow-400'
									: 'text-blue-600 dark:text-blue-400'
							}`}
						/>
					)}
				</div>
				<div className="flex-1">
					<p
						className={`text-sm font-semibold ${
							isWarning
								? 'text-yellow-900 dark:text-yellow-200'
								: isSuccess
									? 'text-emerald-900 dark:text-emerald-200'
									: 'text-blue-900 dark:text-blue-200'
						}`}
					>
						{title}
					</p>
					<p
						className={`mt-1 text-xs ${
							isWarning
								? 'text-yellow-700 dark:text-yellow-300'
								: isSuccess
									? 'text-emerald-700 dark:text-emerald-300'
									: 'text-blue-700 dark:text-blue-300'
						}`}
					>
						{description}
					</p>
				</div>
			</div>
		</div>
	);
}

export default function Home() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const { fetchSession } = useSecureFetch();
	const { refreshKey } = useRefresh();

	useEffect(() => {
		let cancelled = false;
		async function checkSession() {
			const session = await fetchSession();
			if (!cancelled) {
				setUser(session?.user || null);
				setLoading(false);
			}
		}
		checkSession();
		return () => { cancelled = true; };
	}, [refreshKey]);

	const greeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return 'Bom dia';
		if (hour < 18) return 'Boa tarde';
		return 'Boa noite';
	};

	return (
		<main className="min-h-screen bg-background">

			<section className="border-b border-border bg-card">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								{greeting()}, {user?.name || user?.email?.split('@')[0] || 'Usuário'}
							</p>
							<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
								Luma Bijoux
							</h1>
							<p className="text-sm text-muted-foreground max-w-lg">
								Seu painel de controle para estoque, vendas e operações.
							</p>
						</div>
						<div className="flex shrink-0 gap-2">
							<Button variant="ghost" size="icon" title="Notificações">
								<Zap className="h-5 w-5" />
							</Button>
							<Button variant="ghost" size="icon" title="Menu">
								<LayoutDashboard className="h-5 w-5" />
							</Button>
						</div>
					</div>
				</div>
			</section>

		
			<section className="border-b border-border bg-muted/30">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex justify-center">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
							<StatsCard
								icon={Package}
								label="Total de peças"
								loading={loading}
							/>
							<StatsCard
								icon={User}
								label="Usuarios ativos"
								loading={loading}
							/>
						</div>
					</div>
				</div>
			</section>


			<section className="border-b border-border">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
					<div className="mb-8">
						<h2 className="text-2xl font-bold tracking-tight">Acesso rápido</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Navegue para as principais funcionalidades do sistema
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{navigationItems.map((item) => {
							const Icon = item.icon;
							return (
								<Link key={item.title} href={item.href}>
									<div className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-1">
										{/* Gradient Background */}
										<div
											className={`absolute inset-0 opacity-0 bg-gradient-to-br ${item.color} transition-opacity group-hover:opacity-10`}
										/>

										<div className="relative z-10">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-2">
														<Icon className="h-5 w-5 text-foreground" />
														<h3 className="text-lg font-semibold">{item.title}</h3>
													</div>
													<p className="mt-2 text-sm text-muted-foreground">
														{item.description}
													</p>
												</div>
												<ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
											</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>

	
			<section className="border-b border-border">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2">
							<h2 className="mb-6 text-2xl font-bold tracking-tight">Avisos</h2>
							<div className="space-y-4">
								<AlertItem
									title="Reposição em andamento"
									description="Últimos itens da coleção primavera serão enviados hoje."
									variant="warning"
								/>
								<AlertItem
									title="Backup realizado"
									description="Backup automático concluído com sucesso às 3:15 AM."
									variant="success"
								/>
								<AlertItem
									title="API conectada"
									description="Integração com sistema de carrinhos está operacional."
									variant="success"
								/>
							</div>
						</div>

						<div>
							<h2 className="mb-6 text-2xl font-bold tracking-tight">Ações</h2>
							<div className="space-y-3">
								<Button
									className="w-full justify-start"
									variant="outline"
									size="sm"
								>
									<Package className="mr-2 h-4 w-4" />
									Adicionar peça
								</Button>
								<Button
									className="w-full justify-start"
									variant="outline"
									size="sm"
								>
									<TrendingUp className="mr-2 h-4 w-4" />
									Gerar relatório
								</Button>
							
								<Button
									className="w-full justify-start"
									variant="outline"
									size="sm"
								>
									<User className="mr-2 h-4 w-4" />
									Novo Usuario
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			
			<section className="bg-muted/30">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
					<p className="text-xs text-muted-foreground">
						Painel interno de administração. Última atualização:{' '}
						<span className="font-medium">alguns minutos atrás</span>
					</p>
				</div>
			</section>
		</main>
	);
}
