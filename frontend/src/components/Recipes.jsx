import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import styles from './Recipes.module.css';

const Recipes = () => {

    return (
        <div className={styles.pageContainer}>
            <NavBar/>

            <div className={styles.contentWrap}>
                <div className={styles.mainContent}>
                    {/* Add your future content here */}
                </div>
            </div>
            <Footer/>
        </div>
    )
}
export default Recipes;
