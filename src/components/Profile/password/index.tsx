'use client';

import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import styles from "./styles.module.scss";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import profileService from "../../../services/profileService";
import ToastComponent from "../../common/toastComponent";

const validatePasswordStrength = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export default function PasswordForm() {
  const [toastIsOpen, setToastIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [color, setColor] = useState("");
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Opcional: buscar dados iniciais se necessário
  }, []);

  const handlePasswordUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Senha e confirmação de senha diferentes!");
      setColor("bg-danger");
      setToastIsOpen(true);
      setTimeout(() => setToastIsOpen(false), 2100);
      return;
    }
    if (currentPassword === newPassword) {
      setErrorMessage("Senha antiga e nova são iguais!");
      setColor("bg-danger");
      setToastIsOpen(true);
      setTimeout(() => setToastIsOpen(false), 2100);
      return;
    }
    if (!validatePasswordStrength(newPassword)) {
      setErrorMessage(
        "A senha deve conter pelo menos 8 caracteres, incluindo letras, números e caracteres especiais (@, $, !, %, *, ?, &)"
      );
      setColor("bg-danger");
      setToastIsOpen(true);
      setTimeout(() => setToastIsOpen(false), 2700);
      return;
    }

    const { status } = await profileService.passwordUpdate({
      currentPassword,
      newPassword,
    });

    if (status === 204) {
      setErrorMessage("Senha alterada com sucesso!");
      setColor("bg-success");
      setToastIsOpen(true);
      setTimeout(() => setToastIsOpen(false), 3000);
      sessionStorage.clear();
      router.push("/");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    if (status === 400) {
      setErrorMessage("Senha atual incorreta!");
      setColor("bg-danger");
      setToastIsOpen(true);
      setTimeout(() => setToastIsOpen(false), 3000);
    }
  };

  return (
    <section className={styles.passwordSection}>
      <Form className={styles.forms} onSubmit={handlePasswordUpdate}>
        <header className={styles.formHeader}>
          <h2 className={styles.formTitle}>ALTERAR SENHA</h2>
        </header>
        <div className={styles.inputGroup}>
          <FormGroup>
            <Label className={styles.label} htmlFor="currentPassword">
              SENHA ATUAL
            </Label>
            <Input
              name="currentPassword"
              type="password"
              id="currentPassword"
              placeholder="******"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={styles.input}
            />
          </FormGroup>
          <FormGroup>
            <Label className={styles.label} htmlFor="newPassword">
              NOVA SENHA
            </Label>
            <Input
              name="newPassword"
              type="password"
              id="newPassword"
              placeholder="******"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
            />
          </FormGroup>
          <FormGroup>
            <Label className={styles.label} htmlFor="confirmPassword">
              CONFIRMAR NOVA SENHA
            </Label>
            <Input
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              placeholder="******"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
            />
          </FormGroup>
        </div>
        <Button type="submit" className={styles.submitButton}>
          Salvar Alterações
        </Button>
        <ToastComponent color={color} isOpen={toastIsOpen} message={errorMessage} />
      </Form>
    </section>
  );
}
