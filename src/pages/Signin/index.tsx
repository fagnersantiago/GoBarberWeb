import React, {useRef, useCallback} from 'react';
import {FiLogIn, FiMail, FiLock} from 'react-icons/fi';
import logImg from '../../assets/logo.svg';
import {FormHandles} from '@unform/core';
import {Form} from '@unform/web';
import Input from '../../components/input';
import Button from '../../components/button';
import {Link,useHistory} from 'react-router-dom';
import {Container, Content, AnimationContainer, Background} from './styles';
import  * as Yup from 'yup';
import {useAuth}  from '../../Hooks/authContext';
import {useToast} from '../../Hooks/ToastContext';
import getValidationError from '../../Utils/getValidationErros';

interface SingInFormData {

    email: string;
    password: string;
}

const SignIn: React.FC =( ) => {

    const formRef = useRef<FormHandles>(null);

    const {user, signIn} = useAuth();

    const { addToast } = useToast();
    const history = useHistory();
 
    console.log(user);

    const handleSubmit = useCallback (async (data: SingInFormData) => {

        try{

            
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                
                email: Yup.string().required('Email é obrigatório').email('Digite um email válido'),
                password: Yup.string().required('Senha obrigatória'),
            });

            await schema.validate(data, {

                abortEarly:false,
            });

        await signIn({
             email: data.email,
             password: data.password
         });

         history.push('/dashboard');

        } catch(err){

            if(err instanceof Yup.ValidationError){
 
                const errors = getValidationError(err);

                formRef.current?.setErrors(errors);

                return;

            }
           
        }

        addToast({
            type:'error',
            title:'erro na autenticação',
            description:'Ocorreu um erro ao fazer login, cheque as credenciais'
        });

    },[signIn, addToast, history]);

 return( 

    <Container>

     <Content>
         <AnimationContainer>
     <img src={logImg}/>
        
         <Form ref={formRef} onSubmit={handleSubmit}>
   
             <h1>Faça seu Logon</h1>
             <Input name= "email" icon={FiMail} placeholder= "Email"/>
             <Input name="password" icon= {FiLock} type="password" placeholder= "Senha" />
             <Button type="submit">Entrar</Button>
             <Link to="/forgot-password">Esqueci minha senha</Link>
         </Form> 

         <Link to="/signup">
             <FiLogIn/>
             Criar conta
        </Link>

        </AnimationContainer>
     </Content>
     <Background/>

    </Container>

    );

}

 
export default SignIn;