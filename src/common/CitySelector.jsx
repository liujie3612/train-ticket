import React, { useState, useMemo, useEffect, memo, useCallback } from "react";
import classnames from "classnames";
import "./CitySelector.css";
import PropTypes from "prop-types";

const CityItem = memo(function CityItem(props) {
  const { name, onSelect } = props;

  return (
    <li className="city-li" onClick={() => onSelect(name)}>
      {name}
    </li>
  );
});

CityItem.propTypes = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const CitySection = memo(function CitySection(props) {
  const { title, cities = [], onSelect } = props;

  return (
    <ul className="city-ul">
      <li className="city-li" key="title" data-cate={title}>
        {title}
      </li>
      {cities.map((city) => {
        return (
          <CityItem key={city.name} name={city.name} onSelect={onSelect} />
        );
      })}
    </ul>
  );
});

CitySection.propTypes = {
  title: PropTypes.string.isRequired,
  cities: PropTypes.array,
  onSelect: PropTypes.func.isRequired,
};

// 右侧竖条
const AlphaIndex = memo(function AlphaIndex(props) {
  const { alpha, onClick } = props;

  return (
    <i className="city-index-item" onClick={() => onClick(alpha)}>
      {alpha}
    </i>
  );
});

AlphaIndex.propTypes = {
  alpha: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

// 26字母表
const alphabet = Array.from(new Array(26), (ele, index) => {
  return String.fromCharCode(65 + index);
});

const CityList = memo(function CityList(props) {
  const { sections, onSelect, toAlpha } = props;
  console.log(sections);
  return (
    <div className="city-list">
      <div className="city-cate">
        {sections.map((section) => {
          return (
            <CitySection
              key={section.title}
              title={section.title}
              cities={section.citys}
              onSelect={onSelect}
            ></CitySection>
          );
        })}
      </div>
      <div className="city-index">
        {alphabet.map((alpha) => {
          return <AlphaIndex key={alpha} alpha={alpha} onClick={toAlpha} />;
        })}
      </div>
    </div>
  );
});

CityList.propTypes = {
  sections: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  toAlpha: PropTypes.func.isRequired,
};

const SuggestItem = memo(function SuggestItem(props) {
  const { name, onClick } = props;

  return (
    <li className="city-suggest-li" onClick={() => onClick(name)}>
      {name}
    </li>
  );
});

SuggestItem.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

// 响应search的变化发起网络请求
const Suggest = memo(function Suggest(props) {
  const { searchKey, onSelect } = props;
  const [result, setResult] = useState([]);

  useEffect(() => {
    fetch("/rest/search?key=" + encodeURIComponent(searchKey))
      .then((res) => res.json())
      .then((data) => {
        // result[]
        const { result, searchKey: sKey } = data;
        // 可能很多请求同时同时发起，避免旧的请求后返回，影响结果
        if (sKey === searchKey) {
          setResult(result);
        }
      });
  }, [searchKey]);

  // 没有匹配的话
  const fallBackResult = useMemo(() => {
    if (!result.length) {
      return [
        {
          display: searchKey,
        },
      ];
    }

    return result;
  }, [result, searchKey]);

  return (
    <div className="city-suggest">
      <ul className="city-suggest-ul">
        {fallBackResult.map((item) => {
          return (
            <SuggestItem
              key={item.display}
              name={item.display}
              onClick={onSelect}
            />
          );
        })}
      </ul>
    </div>
  );
});

Suggest.propTypes = {
  searchKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const CitySelector = memo(function CitySelector(props) {
  const { show, onBack, cityData, isLoading, fetchCityData, onSelect } = props;

  const [searchKey, setSearchKey] = useState("");

  // searchKey不变，key就不变
  const key = useMemo(() => searchKey.trim(), [searchKey]);

  useEffect(() => {
    if (!show || cityData || isLoading) {
      return;
    }
    fetchCityData();
  }, [show, cityData, isLoading, fetchCityData]);

  // 会影响CityList的重新渲染
  const toAlpha = useCallback((alpha) => {
    document.querySelector(`[data-cate='${alpha}']`).scrollIntoView();
  }, []);

  const outputCitySections = () => {
    if (isLoading) {
      return <div>loading</div>;
    }

    if (cityData) {
      return (
        <CityList
          sections={cityData.cityList}
          onSelect={onSelect}
          toAlpha={toAlpha}
        />
      );
    }

    return <div>error</div>;
  };

  return (
    <div
      className={classnames("city-selector", {
        hidden: !show,
      })}
    >
      <div className="city-search">
        <div className="search-back" onClick={() => onBack()}>
          <svg width="42" height="42">
            <polyline
              points="25,13 16,21 25,29"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchKey}
            className="search-input"
            placeholder="城市、车站的中文或拼音"
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>

        <i
          onClick={() => setSearchKey("")}
          className={classnames("search-clean", {
            hidden: key.length === 0,
          })}
        >
          &#xf063;
        </i>
      </div>
      {Boolean(key) && (
        <Suggest searchKey={key} onSelect={(key) => onSelect(key)} />
      )}
      {outputCitySections()}
    </div>
  );
});

CitySelector.propTypes = {
  show: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  fetchCityData: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CitySelector;
