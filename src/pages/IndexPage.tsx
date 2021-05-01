import React, { useEffect, useState } from "react";
import MoodofHeader from "../components/MoodofHeader";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { loginState } from "../atoms/atom";
import { COLOR } from "../common/style";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Switch, SwitchClassKey, SwitchProps } from "@material-ui/core";
import { get } from "../common/api";
// @ts-ignore
import StorageIcon from "../images/storage.png";
import { BASE_URL } from "../common/common";

const Container = styled.div`
  width: 320px;
  height: 480px;
  padding: 0;
  margin: 0;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 0 0 0;

  height: 424px;
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%), #FFFFFF;
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;

  width: 320px;
  height: 100px;

  order: 0;

  border-bottom: 1px solid ${COLOR.GRAY["200"]};
  border-radius: 2px;
`

const StatusContainer = styled.div`
  display: flex;
  height: 18px;
  order: 0;
`;

const CurrentStatus = styled.p`
  margin-left: 16px;

  font-family: "Noto Sans KR", serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;

  display: flex;
  align-items: center;

  color: ${COLOR.OVERLAY_DARK["40"]};
`;

const PickerActivationContainer = styled.div`
  display: flex;
  flex-direction: row;
  order: 1;
  margin-top: 4px;
  height: 32px;
`;

const PickerActivation = styled.p`
  margin: 4px 0 0 16px;

  font-family: "Noto Sans KR", serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 22px;

  display: flex;
  align-items: center;
  letter-spacing: -0.01em;

  color: ${COLOR.COOL_GRAY["100"]};
`;

const PickerToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
`;

const PickerCommand = styled.p`
  font-family: "Noto Sans KR", serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;

  display: flex;
  align-items: center;

  margin: 6px 80px 0 8px;

  color: ${COLOR.GRAY["500"]};
`;

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

const PickSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 40,
      height: 24,
      padding: 0,
      margin: theme.spacing(1),
      marginLeft: 16,
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 22,
      height: 22,
    },
    track: {
      borderRadius: 26 / 2,
      backgroundColor: `${COLOR.GRAY["300"]}`,
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const PickerActivationDescription = styled.p`
  font-family: "Noto Sans KR", serif;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;

  display: flex;
  align-items: center;
  order: 2;

  color: ${COLOR.GRAY["500"]};
  margin-left: 16px;
  margin-top: 2px;
`;

const EmptyImageContainer = styled.div`
  width: 288px;
  height: 105px;
  margin-left: 16px;
  margin-top: 3px;

  background: ${COLOR.GRAY["50"]};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmptyImageDescription = styled.p`
  font-family: "Noto Sans KR", serif;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;

  color: ${COLOR.GRAY["500"]};
`;

const SaveImagesContainer = styled.div`
  width: 320px;
  height: 278px;
  padding: 8px 16px 0 16px;
  flex-wrap: wrap;
  overflow: scroll;
  display: flex;
`;

const SavedImage = styled.p`
  font-family: "Noto Sans KR", serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  margin-right: 200px;
  color: ${COLOR.OVERLAY_DARK["40"]};
`;

const ImageContainer = styled.div`
  width: 140px;
  height: 105px;
  margin-right: 8px;
  margin-bottom: 8px;

  :hover span {
    display: inline;
  }
`;

const PickedImage = styled.img`
  width: 140px;
  height: 105px;
  object-fit: cover;
`;

const ImageSize = styled.span`
  display: none;
  position: relative;
  top: -19px;
  left: 0;
  color: rgba(255, 255, 255, 0.8);
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 10px;
  line-height: 14px;
`;

const ProfileContainer = styled.div`
  display: flex;
  width: 320px;
  height: 60px;

  border-top: 1px solid ${COLOR.GRAY["200"]};

  transition: background-color 150ms linear;

  &:hover {
    background-color: ${COLOR.GRAY["100"]};
  }
`;

const ProfileImage = styled.img`
  margin-left: 16px;
  margin-top: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const ProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-top: 11px;
  justify-content: flex-start;
`;

const Nickname = styled.p`
  font-family: "Noto Sans KR", serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: ${COLOR.COOL_GRAY["100"]};
  margin: 0;
`

const Email = styled.p`
  font-family: "Noto Sans KR", serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${COLOR.GRAY["500"]};
  margin: 0 0 12px 0;
`;

const ImageStorageIcon = styled.img`
  width: 24px;
  height: 24px;
  margin: 18px 16px 18px 80px;
  float: right;
  opacity: 0.8;
`;

type User = {
  nickname: string,
  email: string,
  profileUrl: string
}

const IndexPage: React.FC = () => {
  const setIsLogin = useSetRecoilState(loginState);
  const [isPickMode, setIsPickMode] = useState(false);
  const [images, setImages] = useState<Array<{
    src: string;
    width: number;
    height: number;
  }>>([])
  const [user, setUser] = useState<User>({ email: "", nickname: "", profileUrl: "" });

  useEffect(() => {
    const handleMessages = ({ isPickMode, isLogin }: { isPickMode: boolean, isLogin: boolean }) => {
      isPickMode !== undefined ? setIsPickMode(isPickMode) : null;
      isLogin !== undefined ? setIsLogin(isLogin) : null;
    };

    chrome.runtime.onMessage.addListener(handleMessages);

    chrome.storage.sync.get(["isPickMode", "token"], async ({ isPickMode, token }) => {
      setIsPickMode(isPickMode);
      token ? setIsLogin(true) : setIsLogin(false);
      chrome.runtime.sendMessage({ isPickMode });
      try {
        const { data } = await get("/api/me", token);
        setUser(data);
      } catch (e) {
        setIsLogin(false);
        location.reload();
      }
    });

    chrome.storage.local.get("images", ({ images }) => {
        if (images) {
          setImages(images.reverse());
        }
      }
    )

    return () => chrome.runtime.onMessage.removeListener(handleMessages);
  }, []);

  const togglePickMode = () => {
    chrome.runtime.sendMessage({ isPickMode: !isPickMode })
    setIsPickMode(prevState => !prevState);
  }

  const handleProfile = () => {
    chrome.tabs.create({ url: BASE_URL })
  }

  return (
    <Container>
      <MoodofHeader/>
      <MainContainer>
        <ActionContainer>
          <StatusContainer>
            <CurrentStatus>현재상태</CurrentStatus>
          </StatusContainer>
          <PickerActivationContainer>
            <PickerActivation>피커 활성화</PickerActivation>
            <PickerToggleContainer>
              <PickerCommand>Cmd + Shift + S</PickerCommand>
              <PickSwitch checked={isPickMode} onClick={togglePickMode}/>
            </PickerToggleContainer>
          </PickerActivationContainer>
          <PickerActivationDescription>피커 활성화로 이미지를 클릭하여 저장하세요.</PickerActivationDescription>
        </ActionContainer>
        {!images ?
          <EmptyImageContainer>
            <EmptyImageDescription>저장된 이미지가 없습니다.</EmptyImageDescription>
            <SavedImage style={{ margin: "12px 0 8px 46px" }}>최근 저장된 10개의 이미지가 표시됩니다.</SavedImage>
          </EmptyImageContainer> :
          <SaveImagesContainer>
            <SavedImage>저장된 이미지</SavedImage>
            {images.map((image, index) =>
              <ImageContainer>
                <PickedImage key={index} src={image.src}/>
                <ImageSize key={10 + index}>{image.width} x {image.height}</ImageSize>
              </ImageContainer>
            )}
          </SaveImagesContainer>}
        <ProfileContainer onClick={handleProfile}>
          <ProfileImage src={user.profileUrl}/>
          <ProfileInfoContainer>
            <Nickname>{user.nickname}</Nickname>
            <Email>{user.email}</Email>
          </ProfileInfoContainer>
          <ImageStorageIcon src={StorageIcon}/>
        </ProfileContainer>
      </MainContainer>
    </Container>
  );
}

export default IndexPage;