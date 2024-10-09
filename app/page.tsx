"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import BackgroundImage from "../public/images/star-wars-bg.jpeg";

interface Film {
  title: string;
  episode_id: number;
  release_date: string;
  director: string;
  producer: string;
  opening_crawl: string;
  imageUrl?: string; 
}

const coverImages: Record<number, string> = {
  1: '/images/episode1.jpeg', 
  2: '/images/episode2.jpeg',
  3: '/images/episode3.jpeg',
  4: '/images/episode4.jpeg',
  5: '/images/episode5.jpeg',
  6: '/images/episode6.jpeg',
};

const Home = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [hoveredFilm, setHoveredFilm] = useState<Film | null>(null);

  useEffect(() => {
    const fetchFilms = async () => {
      setLoading(true);
      const res = await fetch('https://swapi.dev/api/films/');
      const data = await res.json();
      const filmsWithImages = data.results.map((film: Film) => ({
        ...film,
        imageUrl: coverImages[film.episode_id] || '',
      }));
      setFilms(filmsWithImages);
      setLoading(false);
    };

    fetchFilms();
  }, []);

  return (
    <div className="min-h-screen relative ">
      {/* Background Image */}
      <Image
        src={BackgroundImage} 
        alt="Star Wars Background"
        layout="fill"
        objectFit="cover"
        className="absolute top-0 left-0 z-[-1]"
      />

      <header className="text-center py-8">
        <h1 className="text-5xl text-white font-bold drop-shadow-md">Star Wars Films</h1>
        <p className="text-lg text-white mt-4 drop-shadow-md">Explore the Star Wars universe!</p>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-4 text-white shadow-md">
          <h2 className="text-xl font-bold mb-4">Film List</h2>
          {loading ? (
            <p>Loading...</p>
          ) : films.length === 0 ? (
            <p>No films available.</p>
          ) : (
            <ul>
              {films.map((film) => (
                <li key={film.episode_id}>
                  <span
                    className="cursor-pointer hover:underline"
                    onMouseEnter={() => setHoveredFilm(film)} 
                    onMouseLeave={() => setHoveredFilm(null)} 
                    onClick={() => setSelectedFilm(film)} 
                  >
                    {film.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 flex">
          <div className="w-1/3 flex items-center justify-center">
            {(hoveredFilm || selectedFilm) && ( 
              <Image
                src={(hoveredFilm?.imageUrl || selectedFilm?.imageUrl) || '/images/default.jpeg'}
                alt={hoveredFilm?.title || selectedFilm?.title || 'Star Wars Film'}
                width={200}
                height={300}
                className="object-cover rounded-lg mb-4"
              />
            )}
          </div>
          <div className="w-2/3 pl-6">
            {(hoveredFilm || selectedFilm) && (
              <div className="bg-gray-800 p-4 rounded-lg shadow-md transition-shadow">
                <h2 className="text-2xl font-bold mb-2 text-white">{hoveredFilm?.title || selectedFilm?.title}</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Episode {hoveredFilm?.episode_id || selectedFilm?.episode_id}
                </p>
                <p className="text-sm mb-2 text-white">
                  <strong>Director:</strong> {hoveredFilm?.director || selectedFilm?.director}
                </p>
                <p className="text-sm mb-2 text-white">
                  <strong>Producer:</strong> {hoveredFilm?.producer || selectedFilm?.producer}
                </p>
                <p className="text-sm mb-2 text-white">
                  <strong>Release Date:</strong> {hoveredFilm?.release_date ? new Date(hoveredFilm.release_date).toLocaleDateString() : selectedFilm?.release_date ? new Date(selectedFilm.release_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            )}
            
            {/* Display Opening Crawl Below the Movie Information */}
            {selectedFilm && (
              <div className="bg-gray-700 p-4 rounded-lg mt-4 text-white">
                <h3 className="text-xl font-bold mb-2">Opening Crawl</h3>
                <p className="text-sm">{selectedFilm.opening_crawl}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
