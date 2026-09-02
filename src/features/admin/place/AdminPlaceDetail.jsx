import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PillButton, PrimaryButton } from "../../../components/Button/Button.styles";
import { AdminPlaceAPI } from "./api/adminPlaceApi";
import { getTypeLabel } from "./placeTypeOptions";
import {
  DetailHeader,
  PageTitle,
  HeaderActions,
  InfoCard,
  InfoRow,
  InfoLabel,
  InfoValue,
  ImageGrid,
  ThumbImage,
  StateBox,
} from "./AdminPlaceDetail.styles";

const buildImageUrl = (img) => `${img.imgPath ?? ""}${img.saveName ?? ""}`;

const AdminPlaceDetail = () => {
  const navigate = useNavigate();
  const { placeNo } = useParams();

  const [place, setPlace] = useState(null);
  const [screenState, setScreenState] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchPlace = async () => {
      setScreenState("loading");
      setErrorMessage("");
      try {
        const data = await AdminPlaceAPI.getPlace(placeNo);
        if (ignore) return;
        setPlace(data);
        setScreenState("success");
      } catch (err) {
        if (ignore) return;
        setErrorMessage(
          err?.message || "명소 정보를 불러오지 못했습니다.",
        );
        setScreenState("error");
      }
    };

    fetchPlace();
    return () => {
      ignore = true;
    };
  }, [placeNo]);

  const images = place?.placeImages ?? [];

  return (
    <div>
      <DetailHeader>
        <PageTitle>명소 상세</PageTitle>
        <HeaderActions>
          <PillButton type="button" onClick={() => navigate("/admin/places")}>
            목록으로
          </PillButton>
          {screenState === "success" && (
            <PrimaryButton
              type="button"
              onClick={() => navigate(`/admin/places/edit/${placeNo}`)}
            >
              수정
            </PrimaryButton>
          )}
        </HeaderActions>
      </DetailHeader>

      {screenState === "loading" && (
        <StateBox>명소 정보를 불러오는 중입니다…</StateBox>
      )}

      {screenState === "error" && <StateBox $error>{errorMessage}</StateBox>}

      {screenState === "success" && place && (
        <InfoCard>
          <InfoRow>
            <InfoLabel>명소명</InfoLabel>
            <InfoValue>{place.placeName}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>등록일</InfoLabel>
            <InfoValue>{place.createDate}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>명소 타입</InfoLabel>
            <InfoValue>{getTypeLabel(place.typeDetailNo) || "-"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>주소</InfoLabel>
            <InfoValue>{place.addr || "-"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>설명</InfoLabel>
            <InfoValue>
              {place.placeDescription ?? place.placeDescrpition}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>좌표</InfoLabel>
            <InfoValue>
              {place.xAxis != null && place.yAxis != null
                ? `${place.xAxis}, ${place.yAxis}`
                : "-"}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>이미지</InfoLabel>
            <InfoValue>
              {images.length === 0 ? (
                "등록된 이미지가 없습니다."
              ) : (
                <ImageGrid>
                  {images.map((img) => (
                    <ThumbImage
                      key={img.saveName ?? img.imgOrder}
                      src={buildImageUrl(img)}
                      alt={img.originalName ?? "명소 이미지"}
                    />
                  ))}
                </ImageGrid>
              )}
            </InfoValue>
          </InfoRow>
        </InfoCard>
      )}
    </div>
  );
};

export default AdminPlaceDetail;
