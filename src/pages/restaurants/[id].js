import { gql, useQuery } from "@apollo/client";

import { useRouter } from "next/router";

import Image from "next/image";
// import Loader from "../../components/Loader";
import Loader from "@/components/Loader";
import { centsToDollars } from "@/utils/centsToDollars";

const GET_RESTAURANT_DISHES = gql`
# query Restaurants {
#             restaurants {
#                 data {
#                     id
#                     attributes {
#                         name
#                         description
#                         createdAt
#                         updatedAt
#                         publishedAt
#                         dishes {
#                             data {
#                                 id
#                                 attributes {
#                                     name
#                                     description
#                                     price
#                                     createdAt
#                                     updatedAt
#                                     publishedAt
#                                 }
#                             }
#                         }
#                     }
#                 }
#             }
#         }
  query ($id: ID!) {
    restaurant(id: $id) {
    data {
            id
            attributes {
                name
                description
                dishes {
                    data {
                        id
                        attributes {
                            name
                            description
                            price
                            image {
                                data {
                                    attributes {
                                    url
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  }
`;

function DishCard({ data }) {
    function handleAddItem() {
        // will add some logic here
    }

    return (

        // console.log("*****data.attributes.image.data.attributes.url****"),
        // console.log(data.attributes),
        console.log("----------data---------"),
        console.log(data),
        console.log("Price in cents:", data.attributes.price),
        console.log("Converted price:", centsToDollars(data.attributes.price)),


        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="h-full bg-gray-100 rounded-2xl">
                <Image
                    className="w-full rounded-2xl"
                    height={300}
                    width={300}
                    src={`${process.env.STRAPI_URL || "http://127.0.0.1:1337"}${data.attributes.image.data[0].attributes.url}`}
                    alt=""
                />
                <div className="p-8">
                    <div className="group inline-block mb-4" href="#">
                        <h3 className="font-heading text-xl text-gray-900 hover:text-gray-700 group-hover:underline font-black">
                            {data.attributes.name}
                        </h3>
                        <h2>${centsToDollars(data.attributes.price)}</h2>
                    </div>
                    <p className="text-sm text-gray-500 font-bold">
                        {data.attributes.description}
                    </p>
                    <div className="flex flex-wrap md:justify-center -m-2">
                        <div className="w-full md:w-auto p-2 my-6">
                            <button
                                className="block w-full px-12 py-3.5 text-lg text-center text-white font-bold bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 rounded-full"
                                onClick={handleAddItem}
                            >
                                + Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Restaurant() {
    const router = useRouter();
    const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
        variables: { id: router.query.id },
    });

    if (error) return "Error Loading Dishes";
    if (loading) return <Loader />;
    if (data.restaurant.data.attributes.dishes.data.length) {
        const { restaurant } = data;

        return (
            <div className="py-6">
                <h1 className="text-4xl font-bold text-green-600">
                    {restaurant.data.attributes.name}
                </h1>
                <div className="py-16 px-8 bg-white rounded-3xl">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap -m-4 mb-6">
                            {restaurant.data.attributes.dishes.data.map((res) => {
                                return <DishCard key={res.id} data={res} />;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <h1>No Dishes Found</h1>;
    }
}