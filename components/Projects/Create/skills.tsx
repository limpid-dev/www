import { Plus } from "@phosphor-icons/react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../../Primitives/Button";
import { Input } from "../../Primitives/Input";

interface SkillValues {
  skill: {
    name: string;
  }[];
}

export default function SkillsCreate({ skillAdd, portfolioId }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SkillValues>({
    defaultValues: {
      skill: [
        {
          name: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "skill",
    control,
  });

  const onSubmit = async (data: SkillValues) => {
    // try {
    //   data.certification.forEach(async (post) => {
    //     const { data } = await api.certifications.store(post, portfolioId);
    //     if (data) {
    //       const fileId = data.profileId;
    //       setFileId(fileId);
    //       onSubmitFile(fileId);
    //     } else {
    //       throw new Error("Network response was not ok.");
    //     }
    //   });
    // } catch (error) {
    //   setError("Что то пошло не так, попробуйте позже");
    // }
  };
  return (
    <div>
      <div className="flex flex-col gap-5">
        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <Input
                placeholder="Навык"
                className="w-fit"
                {...register(`skill.${index}.name`)}
              />
            </div>
          );
        })}
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
    </div>
  );
}
