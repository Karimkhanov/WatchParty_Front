"use client"

import Header from "../components/header"
import "./rooms-page.css"

export default function RoomsPage({ navigate }) {
  const rooms = [
    {
      id: 1,
      title: "Toy Story",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rooms%20Page-JyP590CkIWUo5DEwftdSgKYkTyhepb.png",
      users: 3,
      extraUsers: 3,
    },
    {
      id: 2,
      title: "Toy Story",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rooms%20Page-JyP590CkIWUo5DEwftdSgKYkTyhepb.png",
      users: 3,
      extraUsers: 3,
    },
    {
      id: 3,
      title: "Toy Story",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rooms%20Page-JyP590CkIWUo5DEwftdSgKYkTyhepb.png",
      users: 3,
      extraUsers: 3,
    },
    {
      id: 4,
      title: "Toy Story",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rooms%20Page-JyP590CkIWUo5DEwftdSgKYkTyhepb.png",
      users: 3,
      extraUsers: 3,
    },
    {
      id: 5,
      title: "Toy Story",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rooms%20Page-JyP590CkIWUo5DEwftdSgKYkTyhepb.png",
      users: 3,
      extraUsers: 3,
    },
    {
      id: 6,
      title: "Toy Story",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rooms%20Page-JyP590CkIWUo5DEwftdSgKYkTyhepb.png",
      users: 3,
      extraUsers: 3,
    },
  ]

  return (
    <div className="page-container">
      <Header currentPage="rooms" navigate={navigate} />

      <main className="rooms-main">
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-image">
                <img src={room.image || "/placeholder.svg"} alt={room.title} />
              </div>
              <div className="room-info">
                <h3 className="room-title">{room.title}</h3>
                <div className="room-users">
                  {[...Array(room.users)].map((_, i) => (
                    <div key={i} className="user-avatar">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="#666">
                        <circle cx="20" cy="15" r="7" />
                        <path d="M8 35C8 28 13 23 20 23C27 23 32 28 32 35" />
                      </svg>
                    </div>
                  ))}
                  {room.extraUsers > 0 && <span className="extra-users">+{room.extraUsers}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
