import { useRef } from "react";

const videos = [ { id: 1, src: "/videos/demo1.mp4", name: "Jean Artisan", job: "Électricien", location: "Cotonou", avatar: "/avatars/a1.jpg", }, { id: 2, src: "/videos/demo2.mp4", name: "Awa Pro", job: "Menuisière", location: "Porto-Novo", avatar: "/avatars/a2.jpg", }, ];

export default function FeedHorizontal() { const containerRef = useRef(null);

return ( <div
ref={containerRef}
className="flex overflow-x-scroll snap-x snap-mandatory w-screen h-screen bg-white"
> {videos.map((v) => ( <div
key={v.id}
className="relative w-screen h-screen flex-shrink-0 snap-center"
> {/* VIDEO */} <video
src={v.src}
autoPlay
muted
loop
playsInline
className="w-full h-full object-cover"
/>

{/* TOP ACTION BAR */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        {/* PROFILE CIRCLE */}
        <div
          onClick={() => alert('Profil ' + v.name)}
          className="w-12 h-12 rounded-full border border-black overflow-hidden cursor-pointer"
        >
          <img src={v.avatar} alt={v.name} className="w-full h-full object-cover" />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-black text-black bg-white text-sm">
            Contacter
          </button>
          <button className="px-4 py-2 border border-black text-black bg-white text-sm">
            Devis
          </button>
        </div>
      </div>

      {/* INFO BOTTOM */}
      <div className="absolute bottom-6 left-4 text-black">
        <p className="font-semibold">{v.name}</p>
        <p className="text-sm">{v.job} • {v.location}</p>
        <p className="text-xs mt-1">✔ Artisan certifié ArtiRoyce</p>
      </div>
    </div>
  ))}
</div>

); }
