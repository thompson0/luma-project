import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	LayoutDashboard,
	Package,
	Users,
	ClipboardList,
	BarChart3,
	Bell,
	Calendar,
} from "lucide-react";

const summaryCards = [
	{
		label: "Pecas cadastradas",
		value: "248",
		detail: "+12 esta semana",
	},
	{
		label: "Pedidos em andamento",
		value: "19",
		detail: "6 aguardando envio",
	},
	{
		label: "Atendimentos abertos",
		value: "4",
		detail: "Tempo medio 1h",
	},
];

const quickActions = [
	{
		title: "Estoque e pecas",
		description: "Gerencie cadastros, lotes e reposicoes.",
		href: "/catalogo",
		icon: Package,
	},
	{
		title: "Pedidos internos",
		description: "Acompanhe status e separacao.",
		href: "#",
		icon: ClipboardList,
	},
	{
		title: "Clientes e contatos",
		description: "Historico, preferencias e SAC.",
		href: "#",
		icon: Users,
	},
	{
		title: "Relatorios",
		description: "Visao de vendas e desempenho.",
		href: "#",
		icon: BarChart3,
	},
];

export default function Home() {
	return (
		<main className="bg-background text-foreground">
			<section className="border-b border-border bg-muted/20">
				<div className="mx-auto max-w-6xl px-6 pb-12 pt-24 sm:pt-28">
					<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
						<div className="space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
								Painel interno
							</div>
							<h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
								Luma Bijoux Workspace
							</h1>
							<p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
								Acompanhe estoque, pedidos e atendimento em um so lugar. Este painel foi pensado
								para manter a operacao organizada e com informacoes claras.
							</p>
						</div>
						<div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
							<div className="flex items-center gap-3">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
									<LayoutDashboard className="h-6 w-6 text-foreground" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Status do dia</p>
									<p className="text-lg font-semibold">Tudo em ordem</p>
								</div>
							</div>
							<div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
								<Calendar className="h-4 w-4" />
								Atualizado ha poucos minutos
							</div>
						</div>
					</div>
					<div className="mt-10 grid gap-4 md:grid-cols-3">
						{summaryCards.map((card) => (
							<div
								key={card.label}
								className="rounded-2xl border border-border bg-background p-5 shadow-sm"
							>
								<p className="text-sm text-muted-foreground">{card.label}</p>
								<p className="mt-3 text-3xl font-semibold text-foreground">{card.value}</p>
								<p className="mt-2 text-xs text-muted-foreground">{card.detail}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg-background">
				<div className="mx-auto max-w-6xl px-6 py-16">
					<div className="flex flex-col gap-3">
						<h2 className="text-3xl font-semibold">Atalhos da operacao</h2>
						<p className="max-w-2xl text-muted-foreground">
							Acesso rapido aos fluxos principais do sistema interno.
						</p>
					</div>
					<div className="mt-10 grid gap-6 md:grid-cols-2">
						{quickActions.map((item) => {
							const Icon = item.icon;
							return (
								<Link
									key={item.title}
									href={item.href}
									className="group rounded-2xl border border-border bg-muted/10 p-6 transition hover:-translate-y-1 hover:shadow-lg"
								>
									<div className="flex items-start gap-4">
										<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
											<Icon className="h-6 w-6 text-foreground" />
										</span>
										<div>
											<h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
											<p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>

			<section className="bg-muted/20">
				<div className="mx-auto max-w-6xl px-6 py-16">
					<div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
						<div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
							<div className="flex items-start justify-between">
								<div>
									<h3 className="text-xl font-semibold">Avisos e prioridades</h3>
									<p className="mt-2 text-sm text-muted-foreground">
										Acompanhe tarefas urgentes e ajustes pendentes.
									</p>
								</div>
								<Bell className="h-5 w-5 text-muted-foreground" />
							</div>
							<div className="mt-6 space-y-4">
								<div className="rounded-xl border border-border bg-muted/30 p-4">
									<p className="text-sm font-semibold">Separacao da colecao Primavera</p>
									<p className="mt-2 text-xs text-muted-foreground">
										Revisar reposicao de itens mais procurados.
									</p>
								</div>
								<div className="rounded-xl border border-border bg-muted/30 p-4">
									<p className="text-sm font-semibold">Pedidos aguardando embalagem</p>
									<p className="mt-2 text-xs text-muted-foreground">
										Organizar etiquetas e verificar itens personalizados.
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
							<h3 className="text-xl font-semibold">Acoes rapidas</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Atalhos para tarefas administrativas.
							</p>
							<div className="mt-6 flex flex-col gap-3">
								<Button className="justify-start" variant="outline">
									Atualizar precos
								</Button>
								<Button className="justify-start" variant="outline">
									Gerar relatorio semanal
								</Button>
								<Button className="justify-start" variant="outline">
									Registrar novo atendimento
								</Button>
							</div>
							<div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
								<LayoutDashboard className="h-4 w-4" />
								Painel interno - use conforme seu perfil
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
