import { useRef, useState, useEffect, useCallback } from 'react'
import { Undo2, Redo2, Trash2, Save, Eraser, Brush } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const COLORS = [
  '#E94560','#FF6B6B','#FFD93D','#6BCB77','#4D96FF',
  '#C77DFF','#FF9A3C','#00C9FF','#F72585','#FFFFFF',
  '#EAEAEA','#8892A4','#16213E','#1A1A2E','#0F0F23',
  '#A8FF78','#FFC3A0','#FFAFCC','#BDE0FE','#CDB4DB',
]

const MAX_SKETCHES = 30

export default function SketchbookTab() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState('pen') // pen | eraser
  const [color, setColor] = useState('#E94560')
  const [lineWidth, setLineWidth] = useState(4)
  const [history, setHistory] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [sketches, setSketches] = useLocalStorage('create_sketches', [])
  const [view, setView] = useState('canvas') // canvas | gallery
  const lastPos = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0F0F23'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveHistory()
  }, [])

  function saveHistory() {
    const canvas = canvasRef.current
    if (!canvas) return
    setHistory(h => [...h.slice(-19), canvas.toDataURL()])
    setRedoStack([])
  }

  function undo() {
    if (history.length < 2) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const prev = history[history.length - 2]
    img.onload = () => { ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0) }
    img.src = prev
    setRedoStack(r => [history[history.length - 1], ...r])
    setHistory(h => h.slice(0, -1))
  }

  function redo() {
    if (!redoStack.length) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => { ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0) }
    img.src = redoStack[0]
    setHistory(h => [...h, redoStack[0]])
    setRedoStack(r => r.slice(1))
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0F0F23'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveHistory()
  }

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  function startDraw(e) {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    lastPos.current = pos
    setIsDrawing(true)
  }

  function draw(e) {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = tool === 'eraser' ? '#0F0F23' : color
    ctx.globalAlpha = 1
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }

  function endDraw(e) {
    if (!isDrawing) return
    setIsDrawing(false)
    saveHistory()
  }

  function saveSketching() {
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL('image/png')
    const newSketch = { id: Date.now(), data: dataUrl, date: new Date().toISOString(), title: `Tekening ${new Date().toLocaleDateString('nl-NL')}` }
    setSketches(prev => [newSketch, ...prev].slice(0, MAX_SKETCHES))
    clearCanvas()
    setView('gallery')
  }

  function deleteSketch(id) {
    setSketches(prev => prev.filter(s => s.id !== id))
  }

  if (view === 'gallery') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="section-title">Galerij ({sketches.length}/{MAX_SKETCHES})</p>
          <button onClick={() => setView('canvas')} className="btn-accent text-sm">+ Nieuwe tekening</button>
        </div>
        {sketches.length === 0 && (
          <p className="text-[#8892A4] text-sm text-center py-8">Nog geen tekeningen opgeslagen</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {sketches.map(s => (
            <div key={s.id} className="card p-2 space-y-2">
              <img src={s.data} alt={s.title} className="w-full rounded-xl aspect-square object-cover" />
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#8892A4]">{new Date(s.date).toLocaleDateString('nl-NL')}</p>
                <button onClick={() => deleteSketch(s.id)} className="text-[#E94560]"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setView('gallery')} className="text-[#8892A4] text-sm">Galerij →</button>
        <div className="flex gap-2">
          <button onClick={undo} className="p-2 bg-[#16213E] rounded-xl text-[#8892A4]"><Undo2 size={16} /></button>
          <button onClick={redo} className="p-2 bg-[#16213E] rounded-xl text-[#8892A4]"><Redo2 size={16} /></button>
          <button onClick={clearCanvas} className="p-2 bg-[#16213E] rounded-xl text-[#8892A4]"><Trash2 size={16} /></button>
          <button onClick={saveSketching} className="p-2 bg-[#E94560] rounded-xl text-white"><Save size={16} /></button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full rounded-2xl touch-none cursor-crosshair"
        style={{ background: '#0F0F23' }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />

      {/* Gereedschap */}
      <div className="flex gap-2">
        <button
          onClick={() => setTool('pen')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold ${tool === 'pen' ? 'bg-[#E94560] text-white' : 'bg-[#16213E] text-[#8892A4]'}`}
        >
          <Brush size={14} /> Pen
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold ${tool === 'eraser' ? 'bg-[#E94560] text-white' : 'bg-[#16213E] text-[#8892A4]'}`}
        >
          <Eraser size={14} /> Gum
        </button>
      </div>

      {/* Dikte */}
      <div className="card space-y-1">
        <p className="text-xs text-[#8892A4]">Dikte: {lineWidth}px</p>
        <input type="range" min={1} max={20} value={lineWidth} onChange={e => setLineWidth(+e.target.value)} className="w-full accent-[#E94560]" />
      </div>

      {/* Kleurenpalet */}
      <div className="grid grid-cols-10 gap-1.5">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => { setColor(c); setTool('pen') }}
            className={`w-full aspect-square rounded-lg border-2 transition-transform active:scale-95 ${color === c && tool === 'pen' ? 'border-white scale-110' : 'border-transparent'}`}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  )
}
