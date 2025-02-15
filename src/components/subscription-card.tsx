import { formatMoney } from "@/lib/helpers";

interface Discount {
  minAmount: number;
  discount: number;
}

interface SubscriptionOption {
  duration: string;
  discounts: Discount[];
}

interface SubscriptionCardProps {
  option: SubscriptionOption;
  isSelected: boolean;
  onSelect: (option: SubscriptionOption) => void;
  subtotal: number;
  numberOfDeliveries: number;
}

export default function SubscriptionCard({
  option,
  isSelected,
  onSelect,
  subtotal,
  numberOfDeliveries 
}: SubscriptionCardProps) {

  // Menghitung diskon yang berlaku berdasarkan subtotal
  let applicableDiscount = 0;
  for (let discount of option.discounts) {
    if (subtotal >= discount.minAmount) {
      applicableDiscount = discount.discount;
    }
  }

  // Menghitung subtotal diskon jika berlaku
  const discountedSubtotal =
    applicableDiscount > 0
      ? subtotal * ((100 - applicableDiscount) / 100)
      : subtotal;

  return (
    <div
      className={`border-1 flex-col justify-center items-center rounded-xl bg-gray-100 cursor-pointer hover:bg-gray-200 xs:p-2 md:p-4 lg:p-2 xl:p-4 ${
        isSelected
          ? "text-black border-1 border-primary-main bg-primary-surface hover:bg-primary-surface"
          : ""
      }`}
      onClick={() => onSelect(option)}
    >
      <h1 className="text-center font-bold xs:text-base md:text-xl xl:text-2xl">
        {option.duration}
      </h1>
      <p className="text-center italic font-medium xs:text-sm md:text-lg">
            ( {numberOfDeliveries} )
          </p>
      <hr />
      <div className="flex justify-center items-center">
        <div className="items-center mt-2 gap-2">
          {option.discounts.map((discount: any, index: any) => (
            <div key={index}>
              <p className=" xs:text-sm md:text-lg">
                <span className="font-bold xs:text-xs md:text-base lg:text-sm xl:text-base">Diskon {discount.discount}% </span>{" "}
                <span className="xs:text-xs md:text-base lg:text-sm xl:text-base">: {formatMoney(discount.minAmount)}</span>
              </p>
            </div>
          ))}
          {applicableDiscount > 0 && (
            <div className="mt-2 text-center text-black p-2 bg-secondary-main rounded-lg xs:text-sm md:text-base lg:text-sm lg:p-0 xl:p-2 xl:text-base">
              <p className="font-bold italic xs:text-sm md:text-base xl:text-lg">Diskon {applicableDiscount}%</p>
              <div className="flex justify-center items-center xs:gap-0 xs:flex-col md:gap-2 md:flex-row lg:gap-2 lg:flex-row xl:gap-2 ">
                <p className="text-gray-600 line-through font-normal xs:text-xs md:text-base lg:text-sm ">
                  {formatMoney(subtotal)}
                </p>
                <p className=" font-bold xs:text-sm md:text-base lg:text-sm xl:text-base ">{formatMoney(discountedSubtotal)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
