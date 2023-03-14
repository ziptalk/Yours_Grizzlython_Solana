import { useEffect } from 'react';
import spaceBackground from '../asset/image/space-background.png';

type useBackgroundProps = {
    backgroundStyle?: 'SPACE' | 'GRADIENT';
}

export const useBackground = ({ backgroundStyle='SPACE' }:useBackgroundProps) => {
    useEffect(()=>{
        let navbar = document.getElementById('navbar');
        let app = document.getElementById('app');

        if (navbar && app) {
            switch(backgroundStyle) {
                case 'SPACE':
                    document.body.style.backgroundImage = `url(${spaceBackground})`;
                    navbar.style.backgroundColor = '#171819';
                    break;
                case 'GRADIENT':
                    app.style.background = 'linear-gradient(rgb(0, 0, 0) 0%, rgba(92, 54, 238, 0) 100%), rgb(86 57 197)';
                    navbar.style.backgroundColor = 'rgb(5 4 13)';
                    break;
                default:
            }
        }

        return () => {
            document.body.style.backgroundImage = '';
            if (navbar) {
                navbar.style.backgroundColor = '';
            }
            if (app) {
                app.style.background = '';
            }
        }
    }, [backgroundStyle])
}