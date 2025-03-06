import React from 'react'

const MovieCard = ({ movie: {title , poster_path , vote_average, release_date, original_language} }) => {

    return (
        <div className={'movie-card'}>
            <img
                alt={title}
                src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movie-rectangle.png"}
            />

            <div className={'mt-4'}>
                <h3>{title}</h3>
                <div className={'content'}>
                    <div className={'rating'}>
                        <img src={'/star.svg'}/>
                        <p> {vote_average ? ((vote_average * .5).toFixed(1)) : 'No Rating'} </p>
                    </div>
                    <span> | </span>
                    <p className={'lang'}>
                        {original_language}
                    </p>
                    <span> | </span>
                    <p className={'lang'}>
                        { release_date ? release_date.split('-')[0] : 'ND'}
                    </p>
                </div>
            </div>
        </div>

    )
}
export default MovieCard
