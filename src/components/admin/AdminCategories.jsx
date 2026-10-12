import { useState } from 'react'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useData } from '../../context/DataContext'
import { useNotification } from '../../context/NotificationContext'

const emptyCat = { id: '', name: '', icon: '📌', description: '' }

export default function AdminCategories() {
  const { categories, schemes, addCategory, updateCategory, deleteCategory } = useData()
  const { notify } = useNotification()

  const [form, setForm] = useState(emptyCat)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const reset = () => {
    setForm(emptyCat)
    setEditingId(null)
    setError('')
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Name is required.')
    if (!form.icon.trim()) return setError('Icon (emoji) is required.')

    if (editingId) {
      updateCategory(editingId, {
        name: form.name.trim(),
        icon: form.icon.trim(),
        description: form.description.trim(),
      })
      notify('Category updated.', 'success')
    } else {
      const id = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      if (!id) return setError('Name must contain letters.')
      if (categories.find((c) => c.id === id)) return setError('A category with this name already exists.')
      addCategory({
        id,
        name: form.name.trim(),
        icon: form.icon.trim(),
        description: form.description.trim(),
        count: 0,
      })
      notify('Category added.', 'success')
    }
    reset()
  }

  const startEdit = (cat) => {
    setForm({ id: cat.id, name: cat.name, icon: cat.icon, description: cat.description || '' })
    setEditingId(cat.id)
  }

  const onDelete = (cat) => {
    const usedBy = schemes.filter((s) => s.category === cat.id).length
    if (usedBy > 0) {
      notify(`Cannot delete — ${usedBy} scheme(s) use this category.`, 'error')
      return
    }
    if (!confirm(`Delete category "${cat.name}"?`)) return
    deleteCategory(cat.id)
    notify('Category deleted.', 'info')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Categories</h1>
        <p className="mt-1 text-sm text-slate-500">
          Categories group schemes on the discovery page.
        </p>
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingId ? 'Edit Category' : 'Add Category'}
        </h2>
        <form onSubmit={onSubmit} className="mt-3 grid gap-3 sm:grid-cols-2">
          <Input label="Name" placeholder="e.g. Scholarships" value={form.name} onChange={set('name')} />
          <Input label="Icon (emoji)" placeholder="🎓" value={form.icon} onChange={set('icon')} />
          <div className="sm:col-span-2">
            <Input
              label="Description"
              placeholder="Short description"
              value={form.description}
              onChange={set('description')}
            />
          </div>
          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit">{editingId ? 'Save changes' : 'Add category'}</Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={reset}>
                Cancel edit
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[500px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Schemes</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((c) => {
              const count = schemes.filter((s) => s.category === c.id).length
              return (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{c.icon} {c.name}</p>
                    <p className="text-xs text-slate-500">{c.description}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.id}</td>
                  <td className="px-4 py-3 text-slate-600">{count}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => startEdit(c)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete(c)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}