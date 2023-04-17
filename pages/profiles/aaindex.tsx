import { Button } from "../../components/Primitives/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/Primitives/Dialog";
import {
  Field,
  Form,
  Input,
  Label,
  Message,
  Textarea,
} from "../../components/Primitives/Form";

export default function ProfilesIndex() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Создать профиль</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать профиль</DialogTitle>
          <DialogDescription>
            Заполните форму, чтобы создать профиль.
          </DialogDescription>
        </DialogHeader>
        <Form>
          <Field name="title">
            <Label>Название</Label>
            <Input
              placeholder="Web-Разработчик..."
              required
              minLength={1}
              maxLength={255}
            />
            <Message match="tooShort">
              Название профиля должно быть не менее 1 символа
            </Message>
            <Message match="tooLong">
              Название профиля должно быть не более 255 символов
            </Message>
            <Message match="valueMissing">Название профиля обязательно</Message>
          </Field>
          <Field name="location">
            <Label>Локация</Label>
            <Input
              placeholder="Астана, Казахстан..."
              required
              minLength={1}
              maxLength={255}
            />
            <Message match="tooShort">
              Локация профиля должна быть не менее 1 символа
            </Message>
            <Message match="tooLong">
              Локация профиля должна быть не более 255 символов
            </Message>
            <Message match="valueMissing">Локация профиля обязательна</Message>
          </Field>
          <Field name="industry">
            <Label>Сфера деятельности</Label>
            <Input
              placeholder="Информационные технологии..."
              required
              minLength={1}
              maxLength={255}
            />
            <Message match="tooShort">
              Сфера деятельности профиля должна быть не менее 1 символа
            </Message>
            <Message match="tooLong">
              Сфера деятельности профиля должна быть не более 255 символов
            </Message>
            <Message match="valueMissing">
              Сфера деятельности профиля обязательна
            </Message>
          </Field>
          <Field name="description">
            <Label>Описание</Label>
            <Textarea
              placeholder="Кратко опишите себя..."
              required
              minLength={1}
              maxLength={1024}
            />
            <Message match="tooShort">
              Описание профиля должна быть не менее 1 символа
            </Message>
            <Message match="tooLong">
              Описание профиля должна быть не более 1024 символов
            </Message>
            <Message match="valueMissing">Описание профиля обязательна</Message>
          </Field>
          <DialogFooter>
            <Button type="submit">Создать профиль</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
