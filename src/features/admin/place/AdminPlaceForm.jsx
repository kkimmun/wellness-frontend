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
import { Modal } from "../../../components/Modal/Modal";
import { usePlaceImageDelete } from "./usePlaceImageDelete";
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
  LicenseSection,
  LicenseCard,
  LicenseHeader,
  LicenseThumb,
  LicenseMeta,
  LicenseToggle,
  LicenseFields,
  LicenseField,
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

const EMPTY_LICENSE = {
  enabled: false,
  sourceName: "",
  sourcePageUrl: "",
  authorName: "",
  licenseCode: "",
  licenseUrl: "",
  attributionText: "",
};

const LICENSE_FIELDS = [
  "sourceName",
  "sourcePageUrl",
  "authorName",
  "licenseCode",
  "licenseUrl",
  "attributionText",
];

const createLicenseForm = (license) => ({
  ...EMPTY_LICENSE,
  enabled: Boolean(license),
  sourceName: license?.sourceName ?? "",
  sourcePageUrl: license?.sourcePageUrl ?? "",
  authorName: license?.authorName ?? "",
  licenseCode: license?.licenseCode ?? "",
  licenseUrl: license?.licenseUrl ?? "",
  attributionText: license?.attributionText ?? "",
});

const hasRequiredLicenseFields = (license) =>
  license.sourceName.trim() &&
  license.sourcePageUrl.trim() &&
  license.licenseCode.trim() &&
  license.attributionText.trim();

const toLicensePayload = (imgNo, license) => ({
  imgNo,
  sourceName: license.sourceName.trim(),
  sourcePageUrl: license.sourcePageUrl.trim(),
  authorName: license.authorName.trim() || null,
  licenseCode: license.licenseCode.trim(),
  licenseUrl: license.licenseUrl.trim() || null,
  attributionText: license.attributionText.trim(),
});

// S3 장소 이미지 연동: 수정 화면의 기존 이미지는 백엔드가 반환한 완성 URL로 표시한다.
const buildImageUrl = (img) =>
  img.imageUrl || `${img.imgPath ?? ""}${img.saveName ?? ""}`;

const ImageLicenseEditor = ({
  idPrefix,
  imageUrl,
  imageName,
  order,
  value,
  disabled,
  onToggle,
  onChange,
}) => (
  <LicenseCard>
    <LicenseHeader>
      <LicenseThumb src={imageUrl} alt={imageName} />
      <LicenseMeta>
        <strong>
          {order}. {imageName}
        </strong>
        <LicenseToggle htmlFor={`${idPrefix}-enabled`}>
          <input
            id={`${idPrefix}-enabled`}
            type="checkbox"
            checked={value.enabled}
            disabled={disabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          출처·라이선스 정보 입력
        </LicenseToggle>
      </LicenseMeta>
    </LicenseHeader>

    {value.enabled && (
      <LicenseFields>
        <LicenseField>
          <label htmlFor={`${idPrefix}-sourceName`}>출처명 *</label>
          <BaseInput
            id={`${idPrefix}-sourceName`}
            value={value.sourceName}
            maxLength={100}
            disabled={disabled}
            placeholder="예: 김포시 문화관광"
            onChange={(e) => onChange("sourceName", e.target.value)}
          />
        </LicenseField>
        <LicenseField>
          <label htmlFor={`${idPrefix}-authorName`}>저작자</label>
          <BaseInput
            id={`${idPrefix}-authorName`}
            value={value.authorName}
            maxLength={200}
            disabled={disabled}
            placeholder="선택 입력"
            onChange={(e) => onChange("authorName", e.target.value)}
          />
        </LicenseField>
        <LicenseField $wide>
          <label htmlFor={`${idPrefix}-sourcePageUrl`}>
            출처 페이지 URL *
          </label>
          <BaseInput
            id={`${idPrefix}-sourcePageUrl`}
            type="url"
            value={value.sourcePageUrl}
            maxLength={2000}
            disabled={disabled}
            placeholder="https://..."
            onChange={(e) => onChange("sourcePageUrl", e.target.value)}
          />
        </LicenseField>
        <LicenseField>
          <label htmlFor={`${idPrefix}-licenseCode`}>라이선스 코드 *</label>
          <BaseInput
            id={`${idPrefix}-licenseCode`}
            value={value.licenseCode}
            maxLength={50}
            disabled={disabled}
            placeholder="예: CC BY 4.0"
            onChange={(e) => onChange("licenseCode", e.target.value)}
          />
        </LicenseField>
        <LicenseField>
          <label htmlFor={`${idPrefix}-licenseUrl`}>라이선스 URL</label>
          <BaseInput
            id={`${idPrefix}-licenseUrl`}
            type="url"
            value={value.licenseUrl}
            maxLength={2000}
            disabled={disabled}
            placeholder="선택 입력"
            onChange={(e) => onChange("licenseUrl", e.target.value)}
          />
        </LicenseField>
        <LicenseField $wide>
          <label htmlFor={`${idPrefix}-attributionText`}>
            귀속 표기 문구 *
          </label>
          <BaseTextarea
            id={`${idPrefix}-attributionText`}
            value={value.attributionText}
            maxLength={1000}
            disabled={disabled}
            placeholder="예: 사진: 김포시, CC BY 4.0"
            onChange={(e) => onChange("attributionText", e.target.value)}
          />
        </LicenseField>
      </LicenseFields>
    )}
  </LicenseCard>
);

const AdminPlaceForm = () => {
  const navigate = useNavigate();
  const { placeNo } = useParams();
  const mode = placeNo ? "edit" : "add";

  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState([]); // 업로드할 이미지 (순서 = imgOrder)
  const [fileLicenses, setFileLicenses] = useState([]);
  const [currentImages, setCurrentImages] = useState([]); // edit: 기존 등록 이미지

  // edit 모드에서 기존 데이터를 불러오는 상태
  const [loadState, setLoadState] = useState(
    mode === "edit" ? "loading" : "ready",
  );
  const [loadError, setLoadError] = useState("");

  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const imageDelete = usePlaceImageDelete(placeNo, (imgNo) => {
    setCurrentImages((images) => images.filter((image) => image.imgNo !== imgNo));
  });
  const busy = submitting || imageDelete.pending;

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
        setCurrentImages(
          [...(data?.placeImages ?? [])]
            .sort((a, b) => (a.imgOrder ?? 0) - (b.imgOrder ?? 0))
            .map((image) => ({
              ...image,
              licenseForm: createLicenseForm(image.license),
            })),
        );
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
    setFileLicenses((prev) => [
      ...prev,
      ...picked.map(() => createLicenseForm()),
    ]);
    e.target.value = ""; // 같은 파일 다시 선택 가능하도록
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileLicenses((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index, dir) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setFileLicenses((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const moveCurrentImage = (index, dir) => {
    setCurrentImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const updateCurrentImageLicense = (index, field, value) => {
    setCurrentImages((prev) =>
      prev.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,
              licenseForm: { ...image.licenseForm, [field]: value },
            }
          : image,
      ),
    );
  };

  const updateFileLicense = (index, field, value) => {
    setFileLicenses((prev) =>
      prev.map((license, licenseIndex) =>
        licenseIndex === index ? { ...license, [field]: value } : license,
      ),
    );
  };

  const saveImageOrderAndLicenses = async (newImgNos) => {
    const orderedExistingImgNos = currentImages.map((img) => img.imgNo);
    if (orderedExistingImgNos.some((imgNo) => imgNo == null)) {
      throw new Error("이미지 번호를 불러오지 못해 순서를 저장할 수 없습니다.");
    }

    if (
      newImgNos.length !== files.length ||
      newImgNos.some((imgNo) => imgNo == null)
    ) {
      throw new Error("서버가 반환한 새 이미지 번호를 확인할 수 없습니다.");
    }

    const orderedImgNos = [...orderedExistingImgNos, ...newImgNos];
    if (orderedImgNos.length > 0) {
      await AdminPlaceAPI.updatePlaceImageOrder(placeNo, orderedImgNos);
    }

    const licenses = [
      ...currentImages
        .filter((image) => image.licenseForm.enabled)
        .map((image) => toLicensePayload(image.imgNo, image.licenseForm)),
      ...newImgNos.flatMap((imgNo, index) =>
        fileLicenses[index]?.enabled
          ? [toLicensePayload(imgNo, fileLicenses[index])]
          : [],
      ),
    ];
    await AdminPlaceAPI.updatePlaceImageLicenses(placeNo, licenses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setFormError("");

    if (!form.placeName.trim()) {
      setFieldError("명소명을 입력해주세요.");
      return;
    }

    const licenseForms = [
      ...currentImages.map((image) => ({
        name: image.originalName ?? "기존 이미지",
        value: image.licenseForm,
      })),
      ...files.map((file, index) => ({
        name: file.name,
        value: fileLicenses[index],
      })),
    ];
    const invalidLicense = licenseForms.find(
      ({ value }) => value?.enabled && !hasRequiredLicenseFields(value),
    );
    if (invalidLicense) {
      setFormError(
        `${invalidLicense.name}: 출처명, 출처 페이지 URL, 라이선스 코드, 귀속 표기 문구를 입력해주세요.`,
      );
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
    fileLicenses.forEach((license, index) => {
      fd.append(`imageLicenses[${index}].enabled`, String(license.enabled));
      if (license.enabled) {
        LICENSE_FIELDS.forEach((field) => {
          fd.append(`imageLicenses[${index}].${field}`, license[field]);
        });
      }
    });

    setSubmitting(true);
    try {
      if (mode === "add") await AdminPlaceAPI.createPlace(fd);
      else {
        const result = await AdminPlaceAPI.updatePlace(placeNo, fd);
        await saveImageOrderAndLicenses(result?.newImgNos ?? []);
      }
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
                    {currentImages.map((img, index) => (
                      <PreviewCard key={img.imgNo ?? img.saveName ?? img.imgOrder}>
                        <PreviewThumbWrap>
                          <PreviewImage
                            src={buildImageUrl(img)}
                            alt={img.originalName ?? "기존 이미지"}
                          />
                          <OrderBadge>{index + 1}</OrderBadge>
                        </PreviewThumbWrap>
                        <PreviewControls>
                          <button
                            type="button"
                            onClick={() => moveCurrentImage(index, -1)}
                            disabled={busy || index === 0}
                            aria-label={`${img.originalName ?? "기존 이미지"} 앞으로 이동`}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCurrentImage(index, 1)}
                            disabled={
                              busy || index === currentImages.length - 1
                            }
                            aria-label={`${img.originalName ?? "기존 이미지"} 뒤로 이동`}
                          >
                            ▼
                          </button>
                          <button type="button"
                            onClick={() => imageDelete.requestDelete(img)}
                            disabled={busy || img.imgNo == null}
                            aria-label={`${img.originalName ?? "기존 이미지"} 삭제`}>
                            삭제
                          </button>
                        </PreviewControls>
                      </PreviewCard>
                    ))}
                  </PreviewGrid>
                </>
              ) : (
                <CurrentImageNote>등록된 이미지가 없습니다.</CurrentImageNote>
              )}
              <CurrentImageNote>
                화살표로 기존 이미지 순서를 변경할 수 있습니다. 새 이미지는 기존
                이미지 뒤에 추가됩니다. 이미지 삭제는 수정 완료와 별개로 즉시 반영됩니다.
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
                        disabled={busy || index === 0}
                        aria-label="앞으로 이동"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFile(index, 1)}
                        disabled={busy || index === previews.length - 1}
                        aria-label="뒤로 이동"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={busy}
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

          {(currentImages.length > 0 || previews.length > 0) && (
            <LicenseSection>
              <CurrentImageLabel>이미지별 출처·라이선스 정보</CurrentImageLabel>
              <CurrentImageNote>
                저작권 표기가 필요한 이미지만 체크하세요. 기존 이미지의 체크를
                해제하고 저장하면 등록된 라이선스 정보가 제거됩니다.
              </CurrentImageNote>

              {currentImages.map((image, index) => (
                <ImageLicenseEditor
                  key={`current-license-${image.imgNo}`}
                  idPrefix={`current-license-${image.imgNo}`}
                  imageUrl={buildImageUrl(image)}
                  imageName={image.originalName ?? "기존 이미지"}
                  order={index + 1}
                  value={image.licenseForm}
                  disabled={busy}
                  onToggle={(checked) =>
                    updateCurrentImageLicense(index, "enabled", checked)
                  }
                  onChange={(field, value) =>
                    updateCurrentImageLicense(index, field, value)
                  }
                />
              ))}

              {previews.map((preview, index) => (
                <ImageLicenseEditor
                  key={`new-license-${preview.url}`}
                  idPrefix={`new-license-${index}`}
                  imageUrl={preview.url}
                  imageName={preview.file.name}
                  order={currentImages.length + index + 1}
                  value={fileLicenses[index] ?? createLicenseForm()}
                  disabled={busy}
                  onToggle={(checked) =>
                    updateFileLicense(index, "enabled", checked)
                  }
                  onChange={(field, value) =>
                    updateFileLicense(index, field, value)
                  }
                />
              ))}
            </LicenseSection>
          )}
        </Field>

        {imageDelete.message && <p role="status">{imageDelete.message}</p>}
        {formError && <FormError>{formError}</FormError>}

        <Actions>
          <PrimaryButton type="submit" disabled={busy}>
            {submitting ? "저장 중…" : mode === "add" ? "등록" : "수정 완료"}
          </PrimaryButton>
        </Actions>
      </Form>
      <Modal {...imageDelete.modalProps}>
        {imageDelete.error && <p role="alert">{imageDelete.error}</p>}
      </Modal>
    </div>
  );
};

export default AdminPlaceForm;
