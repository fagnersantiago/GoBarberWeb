import {Container} from './styles';
import React, {ButtonHTMLAttributes} from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {

    loading?:boolean;
};



const Button: React.FC <ButtonProps>= ({children, loading, ...rest}) =>(

    <Container type="button" {...rest}>

        {loading ? 'carregando...' : children}
    
    </Container>
);
export default Button;