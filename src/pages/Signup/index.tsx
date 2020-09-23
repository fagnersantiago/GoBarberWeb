import React, {useCallback, useRef} from 'react';
import{FormHandles} from '@unform/core';
import {FiArrowLeft, FiMail, FiUser, FiLock} from 'react-icons/fi';
import * as Yup from 'yup';
import {Link, useHistory} from 'react-router-dom';
import logImg from '../../assets/logo.svg';
import Input from '../../components/input';
import Button from '../../components/button';
import {Form} from '@unform/web';
import getValidationError from '../../Utils/getValidationErros';
import {Container, Content, AnimationContainer, Background} from './styles';
import api from '../../services/api';
import { useToast} from '../../Hooks/ToastContext';

interface SignupFormData{

    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC =() => {

    const formRef = useRef<FormHandles>(null);
     
     const {addToast} = useToast();
     const history = useHistory();

   const handleSubmit = useCallback (async (data: SignupFormData) => {

        try {
            
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Nome é obrigatório'),
                email: Yup.string().required('Email é obrigatório').email('Digite um email válido'),
                password: Yup.string().min(6, 'No mínimo uma senha com 6 dígitos'),
            });

            await schema.validate(data, {

                abortEarly:false,
            });

            await api.post('/users', data);

            addToast({
                type:'success',
                title:'Cadastro realizado com sucesso',
                description:"Você já pode realizar seu logon"
            });


            history.push('/');
         

        } catch(err){

            if(err instanceof Yup.ValidationError){

            const errors = getValidationError(err);

            formRef.current?.setErrors(errors);
        }
    }
        addToast({
            type:'error',
            title:'erro na cadastro',
            description:'Ocorreu um erro ao realizar cadastro, tente novamente'
        });

    },[addToast, history]);

    return ( 
    
    <Container>
       <Background/>
         <Content>
             <AnimationContainer>
         
        <img src={logImg}/>
           
            <Form ref={formRef} onSubmit={handleSubmit}>
      
                <h1>Faça seu cadastro </h1>
                <Input name="name" icon= {FiUser} placeholder= "Nome" />
                <Input name="email" icon= {FiMail} placeholder= "Nome" />
                <Input name="password" icon= {FiLock} type="password" placeholder= "Senha" />
                <Button type="submit">Cadastrar</Button>
               
            </Form> 
   
            <Link to="/">
                <FiArrowLeft/>
                Voltar para logon
             </Link>

             </AnimationContainer>
        </Content>
        
   
       </Container>
   
   )
    ;
} 

export default SignUp;