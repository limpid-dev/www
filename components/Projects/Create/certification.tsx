import { Paperclip, Plus } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../../Primitives/Button";
import { Input } from "../../Primitives/Input";
import { TextArea } from "../../Primitives/TextArea";

interface CertificationValues {
  certification: {
    institution: string;
    title: string;
    description: string;
    issuedAt: string;
    expiredAt: string;
  }[];
}

export function CertificationCreate({ certificateAdd, portfolioId }: any) {
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileId, setFileId] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CertificationValues>({
    defaultValues: {
      certification: [
        {
          institution: "Компания",
          title: "Должность",
          description: "desc",
          issuedAt: "",
          expiredAt: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "certification",
    control,
  });

  const onSubmitFile = async (fileId: any) => {
    setIsUploading(true);
    const inputFile = document.querySelector("#fileInput") as HTMLInputElement;

    const formData = new FormData();
    // formData.append("file", inputFile.files?.item(0) as File);

    for (const f of inputFile.files as any) {
      formData.set("file", f);
    }

    const result = await fetch(
      `/api/profiles/${portfolioId}/certificates/${fileId}/files`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      }
    );
    setIsUploading(false);
  };

  const onSubmit = async (data: CertificationValues) => {
    try {
      data.certification.forEach(async (post) => {
        const response = await fetch(
          `/api/profiles/${portfolioId}/certificates`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ ...post }),
          }
        ).then(async (response) => {
          if (response.ok) {
            const json = await response.json();
            const finalId = json.data?.profile_id;
            setFileId(finalId);
            onSubmitFile(fileId);
          } else {
            throw new Error("Network response was not ok.");
          }
        });
      });
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };

  return (
    <div className=" m-auto border-none sm:w-3/4">
      <div className="m-auto flex  flex-col gap-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex flex-col gap-5">
                <div className="flex gap-5">
                  <Input
                    placeholder="Название сертификата"
                    {...register(`certification.${index}.title`)}
                  />
                  <Input
                    placeholder="Название сертификата"
                    {...register(`certification.${index}.institution`)}
                  />
                </div>

                <Input id="fileInput" type="file" />
                <div className="flex w-fit flex-col justify-center gap-5 md:flex-row">
                  <div className="flex items-center justify-between gap-3">
                    <p>Начало</p>
                    <Input
                      className="rounded-lg border p-1"
                      placeholder="начало"
                      type="date"
                      id="birthday"
                      {...register(`certification.${index}.issuedAt`, {
                        setValueAs: (value: string | undefined) =>
                          value ? new Date(value).toISOString() : undefined,
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p>Конец</p>
                    <input
                      className="rounded-lg border p-1"
                      type="date"
                      id="birthday"
                      {...register(`certification.${index}.expiredAt`, {
                        setValueAs: (value: string | undefined) =>
                          value ? new Date(value).toISOString() : undefined,
                      })}
                    />
                  </div>
                </div>
                <TextArea
                  className="bg-slate-100"
                  placeholder="За что получен сертификат? За какое достижение получена награда?"
                  {...register(`certification.${index}.description`)}
                />
              </div>
            );
          })}
          <div className="mt-4 flex flex-col gap-4">
            <Button
              type="button"
              onClick={() => {
                append({
                  institution: "",
                  title: "",
                  description: "",
                  issuedAt: "",
                  expiredAt: "",
                });
              }}
              variant="outline"
            >
              <Plus /> Добавить сертификат
            </Button>
          </div>
          <div className="mt-5 flex justify-end gap-3 pt-4">
            <Button onClick={certificateAdd}>Отмена</Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
