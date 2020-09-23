import React, {useRef, useCallback, useState} from 'react';
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
import api from '../../services/api';

interface ForgotPasswordInFormData {

    email: string;
    
}

const ForgotPassword: React.FC =( ) => {

    const formRef = useRef<FormHandles>(null);
    const [loading, setLoading ] = useState(false);

    const { addToast } = useToast();
    

    const handleSubmit = useCallback (async (data: ForgotPasswordInFormData) => {

        try{

            setLoading(true);

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                
                email: Yup.string().required('Email é obrigatório').email('Digite um email válido'),
                
            });

            await schema.validate(data, {

                abortEarly:false,
            });
 
            await api.post('./password/forgot',{

                email: data.email,
            });

            addToast({
                type:"success",
                title:"Email de recuperação envidado",
                description:'Enviamos uma email para recuperação de senha, cheque sua caixa de email.'
                
            })

        } catch(err){

            if(err instanceof Yup.ValidationError){
 
                const errors = getValidationError(err);

                formRef.current?.setErrors(errors);

                return;

            }
           

        addToast({
            type:'error',
            title:'erro na recuperação',
            description:'Ocorreu um erro ao tentar recuperar senha'
        });
    
      }  finally{

            setLoading(false);
        }

    },[ addToast]);

 return( 

    <Container>

     <Content>
         <AnimationContainer>
     <img src={logImg}/>
        
         <Form ref={formRef} onSubmit={handleSubmit}>
   
             <h1>Recuperar Senha</h1>
             <Input name= "email" icon={FiMail} placeholder= "Email"/>
             <Button type="submit">Recuperar</Button>
            
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

 
export default ForgotPassword;