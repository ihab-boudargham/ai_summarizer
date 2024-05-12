import React from 'react';
import { useState, useEffect } from 'react';
import { useLazyGetSummaryQuery } from '../services/article';

const Demo = () => {
  const [article, setArticle] = useState([
    {
      url: '',
      summary: '',
    },
  ]);

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  {
    /* Save the history of all articles */
  }
  const [allArticles, setAllArticles] = useState([]);

  // useEffect to save the history of all articles
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  // on submit we need to create a request
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = {
        ...article,
        summary: data.summary,
      };

      setArticle(newArticle);

      const updatedArticles = [...allArticles, newArticle];
      setAllArticles(updatedArticles);

      localStorage.setItem('articles', JSON.stringify(updatedArticles));

      console.log(newArticle);
    }
  };

  {
    /* getSummary will fetch the summarized data using the article url which will be set to article.url.
  If the data is not null, we will create a new object, newArticle, which will take all the properties (Url which is not null (article.url) and summary that is null for now).
  "summary: data.summary" will fill the summary property with the data that is returned from the API.  */
  }

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search*/}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src="/assets/link.svg"
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />

          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url || ''}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn
          peer-focus:border-gray-700 peer-focus:text-gray-700
          "
          >
            ↵
          </button>
        </form>

        {/* Browser URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn">
                <img
                  src="/assets/copy.svg"
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Results */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img
            src="/assets/loader.svg"
            alt="loader"
            className="w-20 h-20 object-contain"
          />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen. Please try again later.
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div>
              <div className="flex flex-col gap-3">
                <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                  Article <span className="blue_gradient">Summary</span>
                </h2>

                <div className="summary_box">
                  <p className="font-inter font-medium text-sm text-gray-700">
                    {article.summary}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
