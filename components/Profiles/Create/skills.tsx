import { Plus, Trash } from "@phosphor-icons/react";
import router from "next/router";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import api from "../../../api";
import { Entity } from "../../../api/profile-skills";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";

interface SkillValues {
  skills: {
    name: string;
  }[];
}

export default function SkillsCreate({ skillAdd, profileId }: any) {
  const [skillData, setSkillData] = useState<Entity[]>([]);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SkillValues>({
    defaultValues: {
      skills: [
        {
          name: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "skills",
    control,
  });

  const onSubmit = async (data: SkillValues) => {
    try {
      data.skills.forEach(async (post) => {
        const { data } = await api.skills.store(post, profileId);
        if (data) {
          router.reload();
        } else {
          throw new Error("Network response was not ok.");
        }
      });
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-row flex-wrap gap-5"
    >
      {fields.map((field, index) => {
        return (
          <div key={field.id} className="flex gap-5">
            <Input
              placeholder="Навык"
              className="w-fit"
              {...register(`skills.${index}.name`)}
            />
          </div>
        );
      })}
      <div className="flex w-full justify-end gap-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            append({
              name: "",
            });
          }}
        >
          <Plus /> Добавить навык
        </Button>
      </div>
      <div className="mt-5 flex w-full justify-end gap-3 pt-4">
        <Button onClick={skillAdd}>Отмена</Button>
        <Button type="submit">Сохранить</Button>
      </div>
    </form>
  );
}
