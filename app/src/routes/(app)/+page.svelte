<script lang="ts">
	import PageHeading from "$lib/components/page-heading.svelte";
	import MetricCard from "$lib/components/metric-card.svelte";
	import AlertCard from "$lib/components/alert-card.svelte";
	import BoxesIcon from "@lucide/svelte/icons/boxes";
	import AlertTriangleIcon from "@lucide/svelte/icons/alert-triangle";
	import PackageXIcon from "@lucide/svelte/icons/package-x";
	import { productsState, ordersState } from "$lib/stores/app.svelte";
	import { salesTrend } from "$lib/mock/data";

	import * as Card from "$lib/components/ui/card";
	import * as Table from "$lib/components/ui/table";
	import * as Chart from "$lib/components/ui/chart/index.js";
	import { AreaChart } from "layerchart";
	import { scaleBand } from "d3-scale";
	import { cubicInOut } from "svelte/easing";

	const lowThreshold = 3;

	const outOfStock = $derived(productsState.filter((p) => p.stock === 0));
	const lowStock = $derived(productsState.filter((p) => p.stock > 0 && p.stock < lowThreshold));
	const totalUnits = $derived(productsState.reduce((a, p) => a + p.stock, 0));
	const newOrders = $derived(ordersState.filter((o) => o.status === "new"));
	const deadStock = $derived(productsState.filter((p) => p.deadStockDays != null));
	const deadStockTotal = $derived(deadStock.reduce((a, p) => a + p.stock * p.price, 0));
	const revenue = $derived(salesTrend[salesTrend.length - 1].revenue);
	const lastRevenue = $derived(salesTrend[salesTrend.length - 2].revenue);
	const growth = $derived(Math.round(((revenue - lastRevenue) / lastRevenue) * 100));
	const growthLabel = $derived(`${growth >= 0 ? "+" : ""}${growth}%`);
	const growthTone = $derived(growth >= 0 ? "success" : "destructive");

	function formatMoney(n: number) {
		return "₹" + n.toLocaleString("en-IN");
	}

	const revenueConfig = {
		orders: { label: "Orders", color: "var(--chart-2)" },
		revenue: { label: "Revenue (₹)", color: "var(--chart-2)" }
	} satisfies Chart.ChartConfig;

	const revenueData = salesTrend.map((d) => ({ ...d }));

	// category demand summary
	const catSummary = $derived(
		[...productsState]
			.reduce<Map<string, { sold: number; demand: number; revenue: number }>>((m, p) => {
				const cur = m.get(p.category) ?? { sold: 0, demand: 0, revenue: 0 };
				cur.sold += p.sold;
				cur.demand += p.demand;
				cur.revenue += p.price * p.sold;
				m.set(p.category, cur);
				return m;
			}, new Map())
	);

	const catRows = $derived(
		[...catSummary.entries()]
			.map(([name, v]) => ({ name, ...v }))
			.sort((a, b) => b.revenue - a.revenue)
	);
</script>

<div class="flex flex-col gap-6">
	<PageHeading title="Dashboard" description="Boutique health and analytics at a glance" />

	<!-- KPI metrics -->
	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
		<MetricCard label="Revenue (this month)" value={formatMoney(revenue)} badge={growthLabel} badgeTone={growthTone} href="/" />
		<MetricCard label="Active products" value={String(productsState.length)} sub={`${totalUnits} units on hand`} href="/inventory" />
		<MetricCard label="New orders" value={String(newOrders.length)} badge={newOrders.length ? "needs action" : "all clear"} badgeTone={newOrders.length ? "destructive" : "secondary"} href="/orders?tab=new" />
	</div>

	<!-- Alerts row -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<AlertCard
			title="Stock Out"
			value={outOfStock.length}
			hint={outOfStock.map((p) => p.name).slice(0, 2).join(", ")}
			tone="danger"
			icon={AlertTriangleIcon}
			href="/inventory?filter=out-of-stock"
		/>
		<AlertCard
			title="Low Stock"
			value={lowStock.length}
			hint="≤ {lowThreshold} units left"
			tone="warn"
			icon={BoxesIcon}
			href="/inventory?filter=low-stock"
		/>
		<AlertCard
			title="Dead Stock"
			value={deadStock.length}
			hint={formatMoney(deadStockTotal) + " tied up"}
			tone="warn"
			icon={PackageXIcon}
			href="/inventory?filter=dead-stock"
		/>
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Revenue & orders trend</Card.Title>
				<Card.Description>Last 7 months</Card.Description>
			</Card.Header>
			<Card.Content>
				<Chart.Container config={revenueConfig} class="min-h-[200px] w-full">
					<AreaChart
						data={revenueData}
						xScale={scaleBand().padding(0.3)}
						x="month"
						y="revenue"
						axis="x"
						series={[{ key: "revenue", label: revenueConfig.revenue.label, color: revenueConfig.revenue.color }]}
						props={{
							area: { motion: { type: "tween", duration: 500, easing: cubicInOut } },
							line: { strokeWidth: 2 }
						}}
					>
						{#snippet tooltip()}
							<Chart.Tooltip hideLabel />
						{/snippet}
					</AreaChart>
				</Chart.Container>
			</Card.Content>
			<Card.Footer>
				<div class="flex w-full items-start gap-2 text-sm">
					<div class="grid gap-1.5">
						<div class="flex items-center gap-2 leading-none font-medium">
							₹{revenueData[revenueData.length - 1].revenue.toLocaleString("en-IN")} last month
						</div>
						<div class="flex items-center gap-2 leading-none text-muted-foreground">
							Revenue and order volume over the last 7 months
						</div>
					</div>
				</div>
			</Card.Footer>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Revenue by saree type</Card.Title>
				<Card.Description>Lifetime revenue contribution</Card.Description>
			</Card.Header>
			<Card.Content class="p-0">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Saree type</Table.Head>
							<Table.Head>Sold</Table.Head>
							<Table.Head class="text-right">Revenue</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each catRows as c (c.name)}
							<Table.Row>
								<Table.Cell class="font-medium">{c.name}</Table.Cell>
								<Table.Cell>{c.sold}</Table.Cell>
								<Table.Cell class="text-right font-medium">₹{c.revenue.toLocaleString("en-IN")}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</div>
