import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PillButton,
  PrimaryButton,
} from "../../../components/Button/Button.styles";
import {
  BaseInput,
  BaseTextarea,
} from "../../../components/Input/Input.styles";
import { DropdownSelect } from "../../../components/Select/Select.styles";
import { AdminPlaceAPI } from "./api/adminPlaceApi";
import { PLACE_TYPE_GROUPS } from "./placeTypeOptions";
import {
  FormHeader,
  PageTitle,
  Form,
  Field,
  Row,
  FileInput,
  PreviewGrid,
  PreviewImage,
  PreviewCard,
  PreviewThumbWrap,
  PreviewControls,
  OrderBadge,
  CurrentImageNote,
  CurrentImageLabel,
  FormError,
  FieldError,
  Actions,
  StateBox,
} from "./AdminPlaceForm.styles";

const EMPTY_FORM = {
  placeName: "",
  placeDescription: "",
  addr: "",
  typeDetailNo: "",
  x_axis: "",
  y_axis: "",
};

const buildImageUrl = (img) => `${img.imgPath ?? ""}${img.saveName ?? ""}`;

const AdminPlaceForm = () => {
  const navigate = useNavigate();
  const { placeNo } = useParams();
  const mode = placeNo ? "edit" : "add";

  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState([]); // 업로드할 이미지 (순서 = imgOrder)
  const [currentImages, setCurrentImages] = useState([]); // edit: 기존 등록 이미지

  // edit 모드에서 기존 데이터를 불러오는 상태
  const [loadState, setLoadState] = useState(
    mode === "edit" ? "loading" : "ready",
  );
  const [loadError, setLoadError] = useState("");

  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode !== "edit") return;
    let ignore = false;

    const fetchPlace = async () => {
      setLoadState("loading");
      setLoadError("");
      try {
        const data = await AdminPlaceAPI.getPlace(placeNo);
        if (ignore) return;
        // 최초 진입 응답: createDate, placeName, placeDescrpition, xAxis, yAxis,
        //               typeDetailNo, addr, placeImages
        setForm((prev) => ({
          ...prev,
          placeName: data?.placeName ?? "",
          placeDescription:
            data?.placeDescription ?? data?.placeDescrpition ?? "",
          addr: data?.addr ?? "",
          typeDetailNo:
            data?.typeDetailNo != null ? String(data.typeDetailNo) : "",
          x_axis: data?.xAxis != null ? String(data.xAxis) : "",
          y_axis: data?.yAxis != null ? String(data.yAxis) : "",
        }));
        setCurrentImages(data?.placeImages ?? []);
        setLoadState("ready");
      } catch (err) {
        if (ignore) return;
        setLoadError(err?.message || "명소 정보를 불러오지 못했습니다.");
        setLoadState("error");
      }
    };

    fetchPlace();
    return () => {
      ignore = true;
    };
  }, [mode, placeNo]);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(
    () => () => previews.forEach((p) => URL.revokeObjectURL(p.url)),
    [previews],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "placeName") setFieldError("");
  };

  const handleAddFiles = (e) => {
    const picked = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...picked]);
    e.target.value = ""; // 같은 파일 다시 선택 가능하도록
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index, dir) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.placeName.trim()) {
      setFieldError("명소명을 입력해주세요.");
      return;
    }

    const fd = new FormData();
    fd.append("placeName", form.placeName);
    fd.append("placeDescription", form.placeDescription);
    fd.append("addr", form.addr);
    fd.append("typeDetailNo", form.typeDetailNo);
    fd.append("xAxis", form.x_axis);
    fd.append("yAxis", form.y_axis);
    if (mode === "add") fd.append("viewCount", "0");
    // 이미지: 표시된 순서대로 imageFiles 를 여러 개 추가 (append 순서 = imgOrder)
    files.forEach((file) => fd.append("imageFiles", file));

    setSubmitting(true);
    try {
      if (mode === "add") await AdminPlaceAPI.createPlace(fd);
      else await AdminPlaceAPI.updatePlace(placeNo, fd);
      navigate("/admin/places");
    } catch (err) {
      setFormError(
        err?.message ||
          (mode === "add"
            ? "명소 등록에 실패했습니다. 다시 시도해주세요."
            : "명소 수정에 실패했습니다. 다시 시도해주세요."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadState === "loading") {
    return <StateBox>명소 정보를 불러오는 중입니다…</StateBox>;
  }

  if (loadState === "error") {
    return (
      <div>
        <StateBox $error>{loadError}</StateBox>
        <Actions>
          <PillButton type="button" onClick={() => navigate("/admin/places")}>
            목록으로
          </PillButton>
        </Actions>
      </div>
    );
  }

  return (
    <div>
      <FormHeader>
        <PageTitle>{mode === "add" ? "명소 추가" : "명소 수정"}</PageTitle>
        <PillButton type="button" onClick={() => navigate("/admin/places")}>
          목록으로
        </PillButton>
      </FormHeader>

      <Form onSubmit={handleSubmit} noValidate>
        <Field>
          <label htmlFor="placeName">명소명</label>
          <BaseInput
            id="placeName"
            name="placeName"
            value={form.placeName}
            onChange={handleChange}
            placeholder="명소명을 입력하세요"
            $hasError={!!fieldError}
          />
          {fieldError && <FieldError>{fieldError}</FieldError>}
        </Field>

        <Field>
          <label htmlFor="placeDescription">설명</label>
          <BaseTextarea
            id="placeDescription"
            name="placeDescription"
            value={form.placeDescription}
            onChange={handleChange}
            placeholder="명소 설명을 입력하세요"
          />
        </Field>

        <Field>
          <label htmlFor="addr">주소</label>
          <BaseInput
            id="addr"
            name="addr"
            value={form.addr}
            onChange={handleChange}
            placeholder="주소를 입력하세요"
          />
        </Field>

        <Field>
          <label htmlFor="typeDetailNo">명소 타입</label>
          <DropdownSelect
            id="typeDetailNo"
            name="typeDetailNo"
            value={form.typeDetailNo}
            onChange={handleChange}
          >
            <option value="">타입 선택</option>
            {PLACE_TYPE_GROUPS.map((group) => (
              <optgroup key={group.type} label={group.type}>
                {group.items.map((item) => (
                  <option key={item.typeDetailNo} value={item.typeDetailNo}>
                    {item.detail}
                  </option>
                ))}
              </optgroup>
            ))}
          </DropdownSelect>
        </Field>

        <Row>
          <Field>
            <label htmlFor="x_axis">경도 (x_axis)</label>
            <BaseInput
              id="x_axis"
              name="x_axis"
              value={form.x_axis}
              onChange={handleChange}
              placeholder="예: 126.xxxx"
            />
          </Field>
          <Field>
            <label htmlFor="y_axis">위도 (y_axis)</label>
            <BaseInput
              id="y_axis"
              name="y_axis"
              value={form.y_axis}
              onChange={handleChange}
              placeholder="예: 37.xxxx"
            />
          </Field>
        </Row>

        <Field>
          <label htmlFor="imageFiles">이미지</label>
          <FileInput
            id="imageFiles"
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddFiles}
          />

          {mode === "edit" && (
            <>
              {currentImages.length > 0 ? (
                <>
                  <CurrentImageLabel>
                    현재 등록된 이미지 ({currentImages.length})
                  </CurrentImageLabel>
                  <PreviewGrid>
                    {currentImages.map((img) => (
                      <PreviewImage
                        key={img.saveName ?? img.imgOrder}
                        src={buildImageUrl(img)}
                        alt={img.originalName ?? "기존 이미지"}
                      />
                    ))}
                  </PreviewGrid>
                </>
              ) : (
                <CurrentImageNote>등록된 이미지가 없습니다.</CurrentImageNote>
              )}
              <CurrentImageNote>
                아래에서 이미지를 추가하면 표시된 순서대로 전체 교체됩니다.
              </CurrentImageNote>
            </>
          )}

          {previews.length > 0 && (
            <>
              <CurrentImageLabel>
                업로드할 이미지 ({previews.length}) — 표시 순서대로 등록됩니다
              </CurrentImageLabel>
              <PreviewGrid>
                {previews.map((p, index) => (
                  <PreviewCard key={p.url}>
                    <PreviewThumbWrap>
                      <PreviewImage src={p.url} alt={p.file.name} />
                      <OrderBadge>{index + 1}</OrderBadge>
                    </PreviewThumbWrap>
                    <PreviewControls>
                      <button
                        type="button"
                        onClick={() => moveFile(index, -1)}
                        disabled={index === 0}
                        aria-label="앞으로 이동"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFile(index, 1)}
                        disabled={index === previews.length - 1}
                        aria-label="뒤로 이동"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label="제거"
                      >
                        ✕
                      </button>
                    </PreviewControls>
                  </PreviewCard>
                ))}
              </PreviewGrid>
            </>
          )}
        </Field>

        {formError && <FormError>{formError}</FormError>}

        <Actions>
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? "저장 중…" : mode === "add" ? "등록" : "수정 완료"}
          </PrimaryButton>
        </Actions>
      </Form>
    </div>
  );
};

export default AdminPlaceForm;
