"use client"
import Image from 'next/image';
import { ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from '@/hooks/use-toast';

interface ProductProps {
  image: string;
  title: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  discount: number;
  id: string;
  className?:string
}

const addToCartMutation = async (productId: string) => {
  console.log(productId)
    const array = productId.split("/")
    const type = array[1]
    const id = array[array.length - 1]
  const response = await axiosInstance.post(
    `cart/add-${type}/${id}`,
    { quantity: 1 }
  );
  return response.data;
};

const Product: React.FC<ProductProps> = ({ id, image, title, rating, reviewCount, price, originalPrice, className }) => {

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (productId: string) => addToCartMutation(productId),
    onSuccess: () => {

      toast({
        title: "نجاح",
        description: "تم إضافة العنصر إلى السلة",
        // يمكنك إضافة المزيد من الخصائص هنا إذا لزم الأمر
      });
      
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      console.log(" item added to cart successfully")
    },
    onError: (error) => {
      console.error('Error adding product to cart:', error);
      // Handle error (e.g., show an error message to the user)
    },
  });

  const handleAddToCart = (id: string) => {
    mutation.mutate(id);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className} w-[250px]  h-fit`} >
      <div className="relative mb-4 overflow-hidden h-[35vh] md:h-[50vh]">
        <Link href={`/shop/${id}`}>
        <Image src={image} alt={title} width={200} height={200} className="w-full h-full rounded-t-lg" />
        </Link>
      </div>
      <div className='p-4'>
      <Link href={`/shop/${id}`} className='hover:text-purple hover:underline'>
      <h3 className="font-bold text-lg mb-2 text-right">{title}</h3>
      </Link>
      <div className="flex items-center justify-end mb-2">
        <span className="text-sm text-gray-600 mr-1">({reviewCount ? reviewCount : '0'})</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
          ))}
        </div>
      </div>
      <div className="flex flex-col-reverse  items-end">
        <button 
          onClick={()=>handleAddToCart(id)}
          disabled={mutation.isPending} 
          className="mt-3 border-2 flex items-center border-purple text-purple px-4 py-2 rounded-lg hover:bg-purple hover:text-white transition duration-300 disabled:opacity-50"
        >
          <p>{mutation.isPending ? 'جاري الإضافة...' : 'إضافة للسلة'}</p>
          <ShoppingBag className='ml-2' />
        </button>
        <div className="text-right">
          <p className="text-purple font-bold">{price.toFixed(2)} ر.س</p>
           <div className='flex items-center'>
          <p className="text-red text-sm mr-2">{100 -Math.floor((price/originalPrice)*100)}%</p>
          <p className="text-gray-500 line-through text-sm">{originalPrice.toFixed(2)} ر.س</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Product;