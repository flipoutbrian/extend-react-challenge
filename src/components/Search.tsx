import React, { FC } from 'react';
import styled from '@emotion/styled';
import { colors, icons } from '../assets';

interface Props {
    handler: (value: string, results: object) => void
};

const Search: FC<Props> = ({ handler }) => {
    let breed = '';
    
    const handleClick = (evt: {}): void => {
        const url = `https://dog.ceo/api/breed/${breed}/images/random/10`;
        fetch( url)
            .then(response => response.json())
            .then((data) => {
                handler(breed, data);
                return data;
            })
            .catch(error => alert(error.message));
    };
    
    const handleInput = (evt: KeyboardEvent<HTMLInputElement>): void  => {
                breed = evt.target.value.toLowerCase();
                if ( evt.keyCode == 13) {
                    let button = evt.target.parentElement.querySelector('Button');
                    button.click();
                }
    };
    
    return (
            <Container>
            <Input onKeyUp={handleInput} />
            <Button onClick={handleClick} >
            <Img src={icons["searchIcon"]} alt="search icon" />
            Search 
        </Button>
        </Container>
    );
};

const Input = styled.input({
    type: 'text',
    name: 'search',
    width: '100%',
    placeholder: 'Dog Breed',
});

const Img = styled.img({
    alignSelf: 'center',
    marginLeft: '20px',
    marginRight: '20px',
});

const Button = styled.button ({
    width: '150px',
    lineHeight: '100%',
    textAlign: 'center',
    borderRadius: '4px',
    backgroundColor: colors['btnColor'],
});

const Container = styled.div({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: '36px',
    align: 'Center',
    verticalAlign: 'Top',
    background: colors['mostlyWhiteGrey'],
});

export default Search;

