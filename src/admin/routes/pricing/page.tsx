import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CurrencyDollar } from "@medusajs/icons"
import { Button, Container, Heading, Input, Text, Tabs, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"

/**
 * Pricing dashboard: edits the width x drop price grid stored in each
 * product category's metadata.price_grid. The storefront reads it from there.
 *
 * Grid shape: { Width_values: number[], Drop_values: number[],
 *               Price_groups: number[][][] }  // [group][dropIdx][widthIdx]
 * A product's fabric group is still its variant price amount (1 = group 1).
 */

type Grid = { Width_values: number[]; Drop_values: number[]; Price_groups: number[][][] }
type Category = { id: string; handle: string; name: string; metadata: Record<string, any> | null }

const HANDLES = ["blinds", "curtains", "shutters"]
const emptyGrid = (): Grid => ({ Width_values: [], Drop_values: [], Price_groups: [] })

const parseList = (s: string) =>
  s.split(/[,\s]+/).map(Number).filter((n) => Number.isFinite(n) && n > 0)

// Resize every group matrix to drops x widths, keeping existing values.
const fit = (g: Grid): Grid => ({
  ...g,
  Price_groups: g.Price_groups.map((m) =>
    g.Drop_values.map((_, d) => g.Width_values.map((_, w) => Number(m?.[d]?.[w] ?? 0)))
  ),
})

const readGrid = (c?: Category): Grid => {
  let raw = c?.metadata?.price_grid
  if (typeof raw === "string") {
    try { raw = JSON.parse(raw) } catch { raw = null }
  }
  if (!raw || typeof raw !== "object") return emptyGrid()
  return fit({
    Width_values: (raw.Width_values ?? []).map(Number),
    Drop_values: (raw.Drop_values ?? []).map(Number),
    Price_groups: raw.Price_groups ?? [],
  })
}

const GridEditor = ({ category }: { category: Category }) => {
  const [grid, setGrid] = useState<Grid>(() => readGrid(category))
  const [widths, setWidths] = useState(grid.Width_values.join(", "))
  const [drops, setDrops] = useState(grid.Drop_values.join(", "))
  const [saving, setSaving] = useState(false)

  const applySizes = () =>
    setGrid((g) => fit({ ...g, Width_values: parseList(widths), Drop_values: parseList(drops) }))

  const addGroup = () =>
    setGrid((g) => fit({ ...g, Price_groups: [...g.Price_groups, []] }))

  const removeGroup = (i: number) =>
    setGrid((g) => ({ ...g, Price_groups: g.Price_groups.filter((_, k) => k !== i) }))

  const setCell = (gi: number, d: number, w: number, v: string) =>
    setGrid((g) => {
      const Price_groups = g.Price_groups.map((m) => m.map((row) => [...row]))
      Price_groups[gi][d][w] = Number(v) || 0
      return { ...g, Price_groups }
    })

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/admin/product-categories/${category.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadata: { ...(category.metadata ?? {}), price_grid: grid } }),
      })
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
      toast.success(`Saved ${category.name} pricing`)
    } catch (e: any) {
      toast.error(`Save failed: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const sizesDirty =
    widths !== grid.Width_values.join(", ") || drops !== grid.Drop_values.join(", ")

  return (
    <div className="flex flex-col gap-y-6 pt-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Text size="small" weight="plus">Widths (mm), comma separated</Text>
          <Input value={widths} onChange={(e) => setWidths(e.target.value)} placeholder="600, 900, 1200" />
        </div>
        <div>
          <Text size="small" weight="plus">Drops (mm), comma separated</Text>
          <Input value={drops} onChange={(e) => setDrops(e.target.value)} placeholder="1200, 1500, 1800" />
        </div>
      </div>
      <div className="flex gap-x-2">
        <Button variant="secondary" size="small" onClick={applySizes} disabled={!sizesDirty}>
          Apply sizes
        </Button>
        <Button variant="secondary" size="small" onClick={addGroup}
          disabled={!grid.Width_values.length || !grid.Drop_values.length}>
          Add price group
        </Button>
      </div>

      {grid.Price_groups.map((m, gi) => (
        <div key={gi} className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <Heading level="h3">Group {gi + 1}</Heading>
            <Button variant="transparent" size="small" onClick={() => removeGroup(gi)}>Remove</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="text-ui-fg-subtle txt-small">
              <thead>
                <tr>
                  <th className="p-1 text-left">Drop \ Width</th>
                  {grid.Width_values.map((w) => <th key={w} className="p-1">{w}</th>)}
                </tr>
              </thead>
              <tbody>
                {grid.Drop_values.map((dv, d) => (
                  <tr key={dv}>
                    <th className="p-1 text-left">{dv}</th>
                    {grid.Width_values.map((_, w) => (
                      <td key={w} className="p-1">
                        <Input size="small" type="number" className="w-24"
                          value={m[d]?.[w] ?? 0}
                          onChange={(e) => setCell(gi, d, w, e.target.value)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div>
        <Button onClick={save} isLoading={saving} disabled={sizesDirty}>Save {category.name} pricing</Button>
        {sizesDirty && <Text size="small" className="mt-1">Apply sizes before saving.</Text>}
      </div>
    </div>
  )
}

const PricingPage = () => {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/admin/product-categories?fields=id,name,handle,metadata&limit=100`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setCategories((d.product_categories ?? []).filter((c: Category) => HANDLES.includes(c.handle))))
      .catch((e) => setError(String(e)))
  }, [])

  return (
    <Container className="flex flex-col gap-y-4">
      <div>
        <Heading level="h1">Pricing</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Price in dollars for each width × drop. A product's variant price picks its group (1 = Group 1).
          The site interpolates between sizes.
        </Text>
      </div>
      {error && <Text className="text-ui-fg-error">{error}</Text>}
      {!categories ? <Text>Loading…</Text> : (
        <Tabs defaultValue={categories[0]?.handle}>
          <Tabs.List>
            {categories.map((c) => <Tabs.Trigger key={c.id} value={c.handle}>{c.name}</Tabs.Trigger>)}
          </Tabs.List>
          {categories.map((c) => (
            <Tabs.Content key={c.id} value={c.handle}><GridEditor category={c} /></Tabs.Content>
          ))}
        </Tabs>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Pricing", icon: CurrencyDollar })

export default PricingPage
