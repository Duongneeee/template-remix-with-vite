/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from "react";
import { Banner, ChoiceList, Link, Text, TextField } from "@shopify/polaris";
import { useLoaderData, useSubmit } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import ReactStars from "react-stars";
import type { ReviewCreate } from "~/backend/types/review.type";
import ModalBlock from "./ModalBlock";

type ReviewProps = {
  dismiss: () => void;
};

/*
Logic Review: 
User feedback sẽ thêm bản ghi mới vào bảng review với isClose true và sẽ mất thanh review.

Khi User gỡ áp thì bản ghi review của User sẽ được update isClose là flase

User cài lại nếu bản ghi cũ 5 sao thì thanh review không hiện, dưới 5 sao sẽ hiện và cho phép người dùng feedback tạo 1 bản ghi mới.
*/

export default function Review({ dismiss }: ReviewProps) {
  const submit = useSubmit();
  const { review } = useLoaderData<LoaderFunction>();
  //create review
  const initial: ReviewCreate = {
    shop: "",
    star: 0,
    review: "",
    isClose: false,

  };

  const [formReview, setFormReview] = useState<ReviewCreate>(initial);

  const [selected, setSelected] = useState<string[]>([]);

  const handleChangeChoiceList = useCallback((value: string[]) => setSelected(value), []);

  const [valueIssue, setValueIssue] = useState('');

  const handleChangeIssue = useCallback(
    (newValue: string) => setValueIssue(newValue),
    [],
  );

  // handle modal review
  const [active, setActive] = useState({ review: false, thank: false });

  const handleChange = useCallback(() => {
    setActive({ review: false, thank: false });
    setValueIssue("");
    setSelected([])
    setStarChange(0);
    if (active.review == false && active.thank == true) {
      dismiss();
    }
  }, [active]);

  const handleButtonReview = useCallback(() => {
    setActive({ review: true, thank: false });
  }, [active]);

  // stars
  const [starChange, setStarChange] = useState(0);

  const ratingChanged = (newRating: number) => {
    setStarChange(newRating);
    setFormReview((prev) => ({
      ...prev,
      star: newRating,
    }));
  };

  const handleSubmitReview = () => {
    setActive({ review: false, thank: true });
    handleReview(formReview);
  };

  const handleGoodReview = () => {
    // if (!review) {
      const data: any = {
        action: "createReview",
        star:5,
        isClose: true,
        review: "",
      };
      submit(data, { method: "post" });
      dismiss();
    // }
  };

  const handleReview = (reviewData: ReviewCreate) => {
    if (valueIssue) {
      selected.push(valueIssue)
    }
    // if (!review) {
      const data: any = {
        action: "createReview",
        isClose: true,
        star:reviewData.star,
        review: JSON.stringify(selected),
      };
      submit(data, { method: "post" });
    // }
  };

  const handleRemoveNoti = () => {
    // if (!review) {
      const data: any = {
        action: "createReview",
        isClose: true,
        star:0,
        review: "",
      };
      submit(data, { method: "post" });
      dismiss();
    // }
  };

  return (
    <div className="my-3">
      <Banner onDismiss={handleRemoveNoti}>
        <div className="md:flex justify-between items-center">
          <Text as="p">
            <Text as="span" fontWeight="semibold">Exciting Update! </Text>
            In the upcoming phase, we’re launching a paid plan with new features. As a thank you for being with us from the start, enjoy  <Text as="span" fontWeight="semibold">FREE LIFETIME ACCESS! </Text>
            We’d be grateful if you could leave a review. Your feedback motivates us to keep improving!
          </Text>

          <div className="flex justify-around mx-3 gap-5">
            <div>
              <Link
                url="https://apps.shopify.com/facebook-multiple-pixel/reviews?show_store_picker=1#modal-show=WriteReviewModal"
                target="_blank"
                onClick={handleGoodReview}
                removeUnderline={true}
              >
                <div className="flex justify-between gap-2">
                  <div className="text-black font-semibold">Good</div>
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#FFB800"
                      d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                    />
                  </svg>
                </div>
              </Link>
            </div>
            <ModalBlock
              activator={
                <div
                  onClick={handleButtonReview}
                  className="cursor-pointer flex justify-between gap-2"
                >
                  <div className="text-black font-semibold hover:underline">
                    Bad
                  </div>
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#FFB800"
                      d="M175.9 448c-35-.1-65.5-22.6-76-54.6C67.6 356.8 48 308.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208s-93.1 208-208 208c-28.4 0-55.5-5.7-80.1-16zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM128 369c0 26 21.5 47 48 47s48-21 48-47c0-20-28.4-60.4-41.6-77.7c-3.2-4.4-9.6-4.4-12.8 0C156.6 308.6 128 349 128 369zm128-65c-13.3 0-24 10.7-24 24s10.7 24 24 24c30.7 0 58.7 11.5 80 30.6c9.9 8.8 25 8 33.9-1.9s8-25-1.9-33.9C338.3 320.2 299 304 256 304zm47.6-96a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm-128 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
                    />
                  </svg>
                </div>
              }
              open={active.review}
              onClose={handleChange}
              title="Write a feedback"
              primaryAction={{
                content: "Feedback",
                onAction: handleSubmitReview,
              }}
              secondaryActions={[
                {
                  content: "Cancel",
                  onAction: handleChange,
                },
              ]}
            >
              <div>
                  
              </div>
              {" "}
              <div>
                <Text as="span" fontWeight="semibold">How would you rate this app?</Text>
                <div className="my-2">
                  <ReactStars
                    value={starChange}
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    color2={"#ffd700"}
                    half={false}
                  />
                </div>
                <div className="my-2">
                  <ChoiceList
                      allowMultiple
                      title={<Text as="span" fontWeight="semibold">What are you unhappy with regarding our system?</Text>}
                      choices={[
                        {
                          label: 'The report data is inaccurate',
                          value: 'The report data is inaccurate',
                        },
                        {
                          label: 'Failed to capture the purchase event',
                          value: 'Failed to capture the purchase event',
                        },
                        {
                          label: 'Unable to connect to a Facebook account',
                          value: 'Unable to connect to a Facebook account',
                        },
                        {
                          label: 'The system encountered an error',
                          value: 'The system encountered an error',
                        }
                      ]}
                      selected={selected}
                      onChange={handleChangeChoiceList}
                  />
                </div>
                  <div className="my-2">
                  <TextField
                    label='Other reasons'
                    value={valueIssue}
                    onChange={handleChangeIssue}
                    multiline={4}
                    autoComplete="off"
                  />
                  </div>
              </div>
            </ModalBlock>

            {/* Modal thank you */}
            <ModalBlock
              activator=""
              open={active.thank}
              onClose={handleChange}
              title="Thank you"
              primaryAction={undefined}
              secondaryActions={[
                {
                  content: "Close",
                  onAction: handleChange,
                },
              ]}
            >
              <div className="text-center">
                <div className="flex justify-center">
                  <svg
                    height="100"
                    width="100"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#1ca037"
                      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                    />
                  </svg>
                </div>
                <Text as="span" fontWeight="semibold">
                      Thanks for giving us your feedback.
                </Text>
              </div>
            </ModalBlock>
          </div>
        </div>
      </Banner>
    </div>
  );
}
