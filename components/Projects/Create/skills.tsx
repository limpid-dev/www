import { Plus } from "@phosphor-icons/react";
import { Button } from "../../Primitives/Button";
import { Input } from "../../Primitives/Input";

export default function SkillsCreate({ skillAdd, portfolioId }: any) {
  return (
    <div>
      <div className="flex flex-col gap-5">
        <Input placeholder="Навык" />
        <Button variant="outline">
          <Plus /> Добавить навык
        </Button>
      </div>
    </div>
  );
}
