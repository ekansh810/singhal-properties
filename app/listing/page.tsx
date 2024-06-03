import prisma from "../lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { NoItems } from "@/components/NoItems";
import { ListingCard } from "@/components/ListingCard";


async function getHomes(userId: string) {
  const data = await prisma.home.findMany({
 where: {
     userId: userId,
     addedCategory: true,
     addedDescription: true,
     addedLocation: true,
    },
    select: {
      id: true,
      title: true,
      categoryName: true,
      description: true,
      location: true,
      price: true,
      photo: true,
      barea: true,
      Bookmark: {
        where: {
          userId: userId,
        },
      },
    },
   }
    );
  return data;
}
async function HomesPage() {
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    if(!user) return redirect('/');
    const data = await getHomes(user?.id);
  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Your Homes</h2>

      {data.length === 0 ? (
        <NoItems
          heading="List a property so that you can see it right here"
          message="Your dont have any properties listed"
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8 mb-36">
          {data.map((item) => (
            <ListingCard
            key={item.id}
            title={item.title as string}
            category={item.categoryName as string}
            imagePath={item.photo as string}
            homeId={item.id}
            price={item.price as number}
            description={item.description as string}
            location={item.location as string}
            userId={user.id}
            barea={item.barea as number}
            pathName="/listing"
            BookmarkId={item.Bookmark[0]?.id as string}
            isBookmarked={item.Bookmark.length > 0 ? true : false}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

export default HomesPage