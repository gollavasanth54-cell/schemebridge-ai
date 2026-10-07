export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SchemeBridge AI — Helping citizens find the right schemes.
      </div>
    </footer>
  )
}