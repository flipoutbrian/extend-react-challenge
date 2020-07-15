import React, { FC } from 'react';
import { hot } from 'react-hot-loader/root';
import styled from '@emotion/styled';
import {colors, icons} from '../assets';
import Header from './Header';
import Heart from './Heart'
import Search from './Search';

const PrimaryImage = 'primary-image';
const HeartImage = 'heart-image';

const App: FC = () => {
    
    const dogZoneId = 'dogZoneId123';
    const favoritesId = 'favoritesId123';
    const favorites = new Set();
    
    const breedImages = (breed, results) => {
        const dogZoneElem = document.getElementById(dogZoneId);
        const favoritesElem = document.getElementById(favoritesId);

        const toggleHeartImage = (parentElem, heartName) => {
            if (!parentElem) {
                alert('Target Element not specified');
            }
            const hearts = parentElem.getElementsByClassName(HeartImage);
            for (let offset = 0; offset < hearts.length; offset++) {
                const heart = hearts[offset];
                heart.style.zIndex =
                    (heart.dataset.imageName ==  heartName) ? '10' : '0';
            }
        }

        const getImageSrc = (target) => {
            const elems = target.getElementsByClassName(PrimaryImage);
            return elems[0].src;
        }
        
        const createImageButton =
            (parentElem,
             onclickHandler,
             imageSrc,
             heartImageName) => {
                 const button = document.createElement('button');
                 button.onclick = onclickHandler;
                 button.style.flexBasis = '200px';
                 button.style.height = '200px';
                 button.style.width = '100%';
                 button.style.marginLeft = '22px';
                 button.style.marginTop = '22px';

                 const div = document.createElement('div');
                 div.style.position = 'relative';
                 div.style.width = '100%';
                 div.style.height = '100%';

                 const img  = document.createElement('img');
                 img.classList.add(PrimaryImage);
                 img.src = imageSrc;
                 img.style.width = '100%';
                 img.style.height = '100%';
                 div.appendChild(img);

                 // now create the heart icon images, use zindex to show/hide
                 ['whiteHeartIcon', 'redHeartIcon'].forEach((heartName) => {
                     const img  = document.createElement('img');
                     img.classList.add(HeartImage);
                     img.src = icons[heartName];
                     img.style.position = 'absolute';
                     img.style.bottom = '10px';
                     img.style.right = '10px';
                     img.dataset.imageName = heartName;
                     div.appendChild(img);
                 });
                 toggleHeartImage(div, heartImageName);
                 button.appendChild(div);
                 parentElem.appendChild(button);
             };

        const findChild = (parentElem, imageSrc) => {
            const children = parentElem.children;
            for (let offset = 0; offset < children.length; offset++) {
                if (imageSrc == getImageSrc(children[offset])) {
                    return children[offset]
                }
            }
            return undefined;
        };

        const favsClickHandler = (evt) => {
            // When clicking on a favorite it will be removed from the favs list
            // and the corresponding dz image will have a white heart instead
            // of a red heart

            // Find favorite and change heart color on dz
            const imageSrc = getImageSrc(evt.currentTarget);
            const child = findChild(dogZoneElem, imageSrc);
            if (child) {
                toggleHeartImage(child, 'whiteHeartIcon');
            }
            // Remove from Favorites
            favoritesElem.removeChild(evt.currentTarget);
            favorites.delete(imageSrc);
        };

        const dzClickHandler = (evt) => {
            const imageSrc = getImageSrc(evt.currentTarget);
            if (favorites.has(imageSrc)) {
                // change heart color and remove from favorites
                const child = findChild(favoritesElem, imageSrc);
                if (child) {
                    child.click();
                }
            }
            else {
                // Clicking on an image will change the heart icon to red
                // and add it to the favorites zone
                createImageButton(favoritesElem,
                                  favsClickHandler,
                                  imageSrc,
                                  'redHeartIcon');
                toggleHeartImage(findChild(dogZoneElem, imageSrc), 'redHeartIcon');
                favorites.add(imageSrc);
            }
        };
        
        const resetZone = (elem, results) => {
            if (!elem) {
                throw new Error('Can not reset display zone without an element');
            }
            const displayValue = elem.style.display;
            favorites.clear();
            // delete any children then repopulate
            while (elem.childElementCount) {
                elem.removeChild(elem.firstElementChild);
            }

            if (results.status == 'success') {
                results.message.forEach((url) => {
                    createImageButton(elem,
                                      dzClickHandler,
                                      url,
                                      'whiteHeartIcon');
                });
            }
            else {
                const child = document.createElement('p');
                child.style.fontWeight = 'bold';
                child.style.backgroundColor = 'red';
                child.innerHTML = results.message;
                elem.appendChild(child);
            }
            elem.style.display = displayValue;
        };
        
        resetZone(dogZoneElem, results);
        resetZone(favoritesElem, {status: 'success', message:[]});
    };

    return (
            <AppContainer>
            <Header />
            <Search handler={breedImages} />
            <ImageZone id={dogZoneId} />
            <HR />
            <FavsHeader >
            <Heart icon="redHeartIcon" alt="red heart icon" />
            <FavsLabel>Favorites</FavsLabel>
            </FavsHeader>
            <ImageZone id={favoritesId} />
            </AppContainer>
    );
};

const HR = styled.hr({
    width: '100%',
});

const FavsHeader = styled.div({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    lineHeight: '16px',
    marginLeft: '16px',
    height: '34px',
});

const FavsLabel = styled.h3({
    marginLeft: '16px',
    fontWeight: 'bold',
    fontSize: '16px',
});

const ImageZone = styled.div({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    minHeight: '45px',
    width: '100%',
});

const AppContainer = styled.div({
    margin: '0 auto',
    height: '100%',
    width: '560px',
    paddingTop: '60px',
    fontFamily: 'Nunito Sans',
    FontStyle: 'Bold',
    fontSize: '24px',
    background: colors['veryLightGray']
});

export default hot(App);
