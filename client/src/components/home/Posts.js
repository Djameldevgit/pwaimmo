import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostCard from '../PostCard';
import LoadIcon from '../../images/loading.gif';
import LoadMoreBtn from '../LoadMoreBtn';
import { getDataAPI } from '../../utils/fetchData';
import { POST_TYPES } from '../../redux/actions/postAction';

const Posts = ({ filters }) => {
    const { homePosts, auth, theme } = useSelector(state => state);
    const dispatch = useDispatch();
    const [load, setLoad] = useState(false);

    // Filtrar los posts según los filtros
    const filteredPosts = homePosts.posts.filter(post => {
        // Filtro por subCategory
        if (filters.subCategory && post.subCategory !== filters.subCategory) {
            return false;
        }

        // Filtro por título
        if (filters.title && !post.title.toLowerCase().includes(filters.title.toLowerCase())) {
            return false;
        }

        // Filtro por wilaya
        if (filters.wilaya && post.wilaya !== filters.wilaya) {
            return false;
        }

        // Filtro por commune
        if (filters.commune && post.commune !== filters.commune) {
            return false;
        }

        // Filtro por fecha
        if (filters.startDate || filters.endDate) {
            const postDate = new Date(post.createdAt); // Asume que tienes un campo createdAt
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            if (startDate && postDate < startDate) {
                return false;
            }
            if (endDate && postDate > endDate) {
                return false;
            }
        }

        // Filtro por precio
        if (filters.minPrice || filters.maxPrice) {
            const postPrice = post.price || 0; // Asume que tienes un campo price
            const minPrice = filters.minPrice ? Number(filters.minPrice) : 0;
            const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : Infinity;

            if (postPrice < minPrice || postPrice > maxPrice) {
                return false;
            }
        }

        return true;
    });

    const handleLoadMore = async () => {
        setLoad(true);
        const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token);

        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: { ...res.data, page: homePosts.page + 1 },
        });

        setLoad(false);
    };

    return (

        <div>


            <div className="post_thumb">
                {/* Mostrar los posts filtrados */}
                {filteredPosts.map(post => (
                    <PostCard key={post._id} post={post} theme={theme} />
                ))}

                {/* Mostrar el ícono de carga */}
                {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}

                {/* Botón para cargar más posts */}

            </div>

            <LoadMoreBtn
                result={homePosts.result}
                page={homePosts.page}
                load={load}
                handleLoadMore={handleLoadMore}
            />

        </div>
    );
};

export default Posts;