import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import api from "../../../api";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import { Input } from "../../../components/primitives/input";
import { TextArea } from "../../../components/primitives/text-area";

interface FormValues {
  title: string;
  location: string;
  industry: string;
  stage: string;
  requiredMoneyAmount: number;
  ownedMoneyAmount: number;
  description: string;
  requiredIntellectualResources: string;
  ownedIntellectualResources: string;
  requiredMaterialResources: string;
  ownedMaterialResources: string;
  profitability: string;
}

export default function Create() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormValues>({});

  const onSubmit = async (post: FormValues) => {
    const profileId = localStorage.getItem("profileId");
    const fullObject = {
      ...post,
      profileId,
    };
    const { data } = await api.projects.store(fullObject);
    if (data) {
      router.push({
        pathname: "/app/projects/resources",
        query: { projectId: data.id },
      });
    }
  };

  return (
    <>
      <div className="h-auto bg-slate-50">
        <Navigation />
        <div className="container mx-auto mb-4 max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Профиль /</span>
            Создание проекта
          </h1>

          <div className="flex items-baseline justify-between">
            <h1 className="pt-7 text-5xl  font-extrabold	">{/* Профиль */}</h1>
          </div>

          <div className="rounded-lg bg-white shadow-sm">
            <div className="m-auto min-h-[500px] border-none sm:w-7/12">
              <form onSubmit={handleSubmit(onSubmit)} className="pb-4">
                <div className="pt-5">
                  <div className="mb-5 text-lg font-semibold sm:text-2xl">
                    Название проекта
                  </div>
                  <Input placeholder="Название" {...register("title")} />
                </div>
                <div className="relative py-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                </div>
                <div className="mb-7">
                  <div className=" mb-5 text-lg font-semibold sm:text-2xl">
                    Основная информация о проекте
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input placeholder="Локация" {...register("location")} />
                    <Input
                      placeholder="Стадия проекта"
                      {...register("stage")}
                    />
                    <Input placeholder="Категория" {...register("industry")} />
                  </div>
                </div>
                <div className="relative py-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                </div>
                <div className="mb-7">
                  <div className=" mb-5 text-lg font-semibold sm:text-2xl">
                    Финансовые данные
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      placeholder="Требуемая сумма"
                      {...register("requiredMoneyAmount", {
                        setValueAs(value) {
                          return value ? Number(value) : 0;
                        },
                      })}
                    />
                    <Input
                      placeholder="Сумма в собственности"
                      {...register("ownedMoneyAmount", {
                        setValueAs(value) {
                          return value ? Number(value) : 0;
                        },
                      })}
                    />
                  </div>
                </div>
                <div className="relative py-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                </div>
                <div className="mb-7">
                  <div className=" mb-5 text-lg font-semibold sm:text-2xl ">
                    О проекте
                  </div>
                  <TextArea
                    {...register("description")}
                    className="bg-slate-100"
                    placeholder="Что будущему партнеру стоит знать о проекте? Опишите ваши цели, идеи и т.д."
                  />
                </div>
                <div className="relative py-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                </div>
                <div className="grid gap-6">
                  <div className="">
                    <p className="mb-5 text-lg font-semibold sm:text-2xl">
                      Ресурсы проекта
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-lg font-semibold">
                          Материальный ресурс
                        </p>
                        <TextArea
                          className="bg-slate-100"
                          {...register("ownedMaterialResources")}
                          placeholder="Укажите какие материальные ресурсы у вас уже имеются"
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-lg font-semibold">
                          Интеллектуальный ресурс
                        </p>
                        <TextArea
                          className="bg-slate-100"
                          {...register("ownedIntellectualResources")}
                          placeholder="Укажите какие интеллектуальные ресурсы у вас уже имеются"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative py-6">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-300" />
                    </div>
                  </div>{" "}
                  <div className="">
                    <p className="mb-5 text-lg font-semibold sm:text-2xl">
                      Требуемые ресурсы проекту
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="mb-2  text-lg font-semibold">
                          Материальный ресурс
                        </p>
                        <TextArea
                          className="bg-slate-100"
                          placeholder="Укажите какие материальные ресурсы вам нужны"
                          {...register("requiredMaterialResources")}
                        />
                      </div>
                      <div>
                        <p className="mb-2  text-lg font-semibold">
                          Интеллектуальный ресурс
                        </p>
                        <TextArea
                          className="bg-slate-100"
                          placeholder="Укажите какие интеллектуальные ресурсы вам нужны"
                          {...register("requiredIntellectualResources")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative py-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                </div>
                <div>
                  <p className=" mb-6 text-2xl font-semibold">
                    Ожидаемая рентабельность
                  </p>
                  <TextArea
                    placeholder="Опишите ожидаемую рентабельность"
                    className="bg-slate-100"
                    {...register("profitability")}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 ">
                  <Link href="/app/projects/my">
                    <Button>Отмена</Button>
                  </Link>
                  <Button type="submit">Далее</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
