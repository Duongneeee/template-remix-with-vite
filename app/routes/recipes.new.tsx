import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import {
  Form,
  useNavigation,
  useActionData,
  useSubmit
} from "@remix-run/react";
import db from "~/db.server";
import { authenticate } from "../shopify.server";

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData() as any;
    const body = Object.fromEntries(formData) as any;
    const data:any = {
      content: body.content
  }
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  console.log(data)
  const recipe = await db.test.create({ data });
  console.log(recipe)
  return json({
    content: recipe.content,
    shop: shop
  });
}

export default function NewRecipe() {
  const res = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting =
    navigation.formAction === "/recipes/new";
    const submit = useSubmit();
    const handleRefreshData= () => {
      const data = {
        id: '122',
        content: '23242'
      }
      submit(data, { method: "post" });
    }
  return (
    <>
      <p>{res?.shop}</p>
      <Form method="post">
        <label>
          id: <input name="id" />
        </label>
        <label>
          Content: <textarea name="content" />
        </label>
        <button type="submit">
          {isSubmitting ? "Saving..." : "Create Recipe"}
        </button>
      </Form>
      <button onClick={() => handleRefreshData()}>
        Refresh
      </button>
    </>
    
  );
}
