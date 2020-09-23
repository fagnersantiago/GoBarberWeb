import React, { useRef, useCallback } from "react";
import { FiLock } from "react-icons/fi";
import logImg from "../../assets/logo.svg";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import Input from "../../components/input";
import Button from "../../components/button";
import { useHistory, useLocation } from "react-router-dom";
import { Container, Content, AnimationContainer, Background } from "./styles";
import * as Yup from "yup";
import { useToast } from "../../Hooks/ToastContext";
import getValidationError from "../../Utils/getValidationErros";
import api from "../../services/api";

interface ResetPasswordInFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();
  const location  = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required("Senha obrigatória"),
          password_confirmation:Yup.string().oneOf(
            [Yup.ref('password')],
            'confirmação de incorreta',
          )
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {password, password_confirmation} = data;
        const token = location.search.replace('?token=', '');

        if(!token){
            throw new Error()
        }
        await api.post('/password/reset',{
            password,
            password_confirmation,
            token,
        })

        history.push("/");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationError(err);

          formRef.current?.setErrors(errors);

          return;
        }
      }

      addToast({
        type: "error",
        title: "erro ao resetar senha",
        description:
          "Ocorreu um erro ao tentar recuperar senha, tente novamente.",
      });
    },
    [addToast, history, location.search]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logImg} />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar Senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação de senha"
            />
            <Button type="submit">Alterar Senhar</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
