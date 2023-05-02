import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Paperclip, Plus } from "@phosphor-icons/react";
import Uppy from "@uppy/core";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "./primitives/button";
import { Input } from "./primitives/input";
import { TextArea } from "./primitives/text-area";

interface CertificationValues {
  certification: {
    institution: string;
    title: string;
    description: string;
    issuedAt: string;
    expiredAt: string;
  }[];
}

export function OrganizationCertificationCreate() {
  const {
    register,
    formState: { errors },
    control,
  } = useForm<CertificationValues>({
    defaultValues: {
      certification: [
        {
          institution: "",
          title: "",
          description: "",
          issuedAt: "",
          expiredAt: "",
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    name: "certification",
    control,
  });

  return (
    <div className="m-auto border-none sm:w-4/6 p-8">
      <div className="m-auto flex  flex-col gap-5">
        <div>
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
                <div className="w-full">
                  <Button
                    onClick={() => {
                      document
                        // eslint-disable-next-line unicorn/prefer-query-selector
                        .getElementById(`certification.${index}.file`)
                        ?.click();
                    }}
                    type="button"
                    variant="outline"
                    className="space-x-2 w-full"
                  >
                    <Paperclip
                      weight="bold"
                      className="h-4 w-4 text-zinc-800"
                    />
                    <span>Прикрепление файлов</span>
                  </Button>
                  <input
                    hidden
                    id={`certification.${index}.file`}
                    type="file"
                    name={`certification.${index}.file`}
                  />
                </div>
                <div className="flex flex-col justify-around gap-5 md:flex-row">
                  <div className="flex items-center justify-between gap-3">
                    <p>Начало</p>
                    <div>
                      <input
                        className="rounded-lg border p-1"
                        placeholder="начало"
                        type="date"
                        id="birthday"
                        {...register(`certification.${index}.issuedAt`, {
                          required: "Please enter your first name.",
                          setValueAs: (value: string | undefined) =>
                            value ? new Date(value).toISOString() : undefined,
                        })}
                      />
                      {errors.certification?.[index]?.issuedAt && (
                        <p className="ml-2 text-sm text-red-500">
                          Выберите дату
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p>Конец</p>
                    <div>
                      <input
                        className="rounded-lg border p-1"
                        placeholder="начало"
                        type="date"
                        id="birthday"
                        {...register(`certification.${index}.expiredAt`, {
                          required: "Please enter your first name.",
                          setValueAs: (value: string | undefined) =>
                            value ? new Date(value).toISOString() : undefined,
                        })}
                      />
                      {errors.certification?.[index]?.expiredAt && (
                        <p className="ml-2 text-sm text-red-500">
                          Выберите дату
                        </p>
                      )}
                    </div>
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
          {/* <div className="mt-5 flex justify-end gap-3 pt-4">
            <Button type="submit">Сохранить</Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
