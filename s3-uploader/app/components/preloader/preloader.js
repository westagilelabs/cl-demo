import React, { Component } from 'react'
import styles from './preloader.css';

export default class Preloader extends Component {
    render() {
        return (
            <div className={styles.loadingDirective}>
                <div className={styles.loader} data-reactid=".3.1.1.0">
                    <svg className={styles.circular} viewBox="0 0 64 64" data-reactid=".3.1.1.0.0">
                        <circle className={styles.path} cx="32" cy="32" r="30" fill="none" strokeWidth="4" data-reactid=".3.1.1.0.0.0"></circle>
                    </svg>
                </div>
            </div>
        )
    }
}