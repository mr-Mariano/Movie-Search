import { useState, useEffect } from 'react'
import { useDebounce } from 'react-use'

import './Index.css'
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3/"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
    method : 'GET',
    headers : {
        accept: 'application/json',
        Authorization : `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [movies, setMovies] = useState( [] )
    const [loading, setLoading] = useState( false )
    const [debounce, setDebounce] = useState('')
    const [trendingMovies, setTrendingMovies] = useState([])

    useDebounce( () => setDebounce( searchTerm ) , 500, [searchTerm])

    const fetchMovies = async (query = '') => {
     try{
         setLoading(true)
         const endPoint = query ?  `${API_BASE_URL}search/movie?query=${encodeURI(query)}` :`${API_BASE_URL}discover/movie?sort_by=popularity.desc`
         const response = await fetch(endPoint, API_OPTIONS)
         if(!response.ok){
             throw new Error('Failed to fetch movies')
         }

         const data = await response.json()
         if(data.Response == 'False'){
             setError( data.error || 'Failed to fetch movies')
             setMovies( [] )
             return
         }

         setMovies( data.results || [])
         if( query && data.results.length > 0){
             await updateSearchCount(query, data.results[0])
         }

     }catch (err){
         setError(`Error fetching movies ${err}`)
         console.log(`Error fetching movies ${err}`)
     }
     finally {
         setLoading(false)
     }
    }

    const loadTrendingMovies = async () => {
        try {
            const trendingMovies = await getTrendingMovies()
            setTrendingMovies(trendingMovies)
        } catch (e) {
            console.log('Error Fetching trending Movies', e)
        }
    }

    useEffect( () => {
        fetchMovies(debounce)
    }, [debounce])

    useEffect(() => {
        loadTrendingMovies()
    }, []);

    return(
        <main>
            <div className='pattern'/>
            <div className='wrapper'>
                <header>
                    <img src="../public/hero.png" alt={"Hero Banner"}/>
                    <h1>Find your next <span className='font-Bebas text-gradient'>Bang</span></h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>

                <section className={'trending'}>
                    <h2>Trending Movies </h2>
                    <ul>
                        { trendingMovies.map( (movie, index) => (
                            <li key={movie.$id}>
                                <p>{index + 1}</p>
                                <img src={movie.poster_url} alt={movie.title}/>
                            </li>
                            ))
                        }
                    </ul>
                </section>


                <section className={'all-movies'}>
                    <h2>All Movies </h2>
                    {
                        loading ? (
                            <Spinner/>
                        ) : error ? (
                            <p className={'text-red-500'}>{error}</p>
                        ) : (
                            <ul>
                                { movies.map( movie => (
                                    <MovieCard key={movie.id} movie={movie}/>
                                ))}
                            </ul>
                        )
                    }


                    { error && <p className={'text-red-500'}>{error}</p> }
                </section>

            </div>
        </main>
    )
}

export default App
