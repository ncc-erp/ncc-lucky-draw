interface SlotConfigurations {
  /** User configuration for maximum item inside a reel */
  maxReelItems?: number;
  /** User configuration for whether winner should be removed from name list */
  removeWinner?: boolean;
  /** User configuration for element selector which reel items should append to */
  reelContainerSelector: string;
  /** User configuration for callback function that runs before spinning reel */
  onSpinStart?: () => void;
  /** User configuration for callback function that runs after spinning reel */
  onSpinEnd?: () => void;

  /** User configuration for callback function that runs after user updates the name list */
  onNameListChanged?: () => void;
}

/** Class for doing random name pick and animation */
export default class Slot {
  /** List of names to draw from */
  private nameList: string[];

  private _excludeList: string[];

  /** Whether there is a previous winner element displayed in reel */
  private havePreviousWinner: boolean;

  /** Container that hold the reel items */
  private reelContainer: HTMLElement | null;

  /** Maximum item inside a reel */
  private maxReelItems: NonNullable<SlotConfigurations['maxReelItems']>;

  /** Whether winner should be removed from name list */
  private shouldRemoveWinner: NonNullable<SlotConfigurations['removeWinner']>;

  /** Reel animation object instance */
  private reelAnimation?: Animation;

  /** Callback function that runs before spinning reel */
  private onSpinStart?: NonNullable<SlotConfigurations['onSpinStart']>;

  /** Callback function that runs after spinning reel */
  private onSpinEnd?: NonNullable<SlotConfigurations['onSpinEnd']>;

  /** Callback function that runs after spinning reel */
  private onNameListChanged?: NonNullable<SlotConfigurations['onNameListChanged']>;

  /**
   * Constructor of Slot
   * @param maxReelItems  Maximum item inside a reel
   * @param removeWinner  Whether winner should be removed from name list
   * @param reelContainerSelector  The element ID of reel items to be appended
   * @param onSpinStart  Callback function that runs before spinning reel
   * @param onNameListChanged  Callback function that runs when user updates the name list
   */
  constructor(
    {
      maxReelItems = 30,
      removeWinner = true,
      reelContainerSelector,
      onSpinStart,
      onSpinEnd,
      onNameListChanged
    }: SlotConfigurations
  ) {
    this.nameList =["HN001_Nguyễn Hồng Vân","HN002_Ngô Thu Hiền","HN003_Nguyễn Thị Nhung","HN004_Chu Hoàng Đức Hạnh","HN005_Nguyễn Thị Phương Anh","HN006_Đỗ Đức Trung","HN007_Nguyễn Kim Đạt","HN008_Nguyễn Thị Ngân Giang","HN009_Nguyễn Đức Hiếu","HN010_Hoàng Đình Trung","HN011_Nguyễn Bá Thiết","HN012_Nguyễn Sơn Tùng","HN013_Văn Nhật Duy","HN014_Bùi Quỳnh Anh","HN015_Đinh Như Thành","HN016_Đỗ Thị Hương","HN017_Nguyễn Tiến Phong","HN018_Trương Thị Mai","HN019_Đặng Danh Phương","HN020_Vũ Tài Linh","HN021_Nguyễn Ngọc Cường","HN022_Trần Đức Dương","HN023_Nguyễn Đăng Hoàng Anh","HN024_Trần Bình Dương","HN025_Đào Hoàng Hữu","HN026_Nguyễn Thu Ngân","HN027_Nguyễn Tuấn Anh","HN028_Nguyễn Sỹ Đạt","HN029_Bùi Hồng Hạnh","HN030_Nguyễn Thành Công","HN031_Nguyễn Nam Hiếu","HN032_Nguyễn Thái Sơn","HN033_Nguyễn Tuấn Đại","HN034_Khuất Thị Trang","HN035_Phan Thị Thục Trinh","HN036_Lê Xuân Trường","HN037_Đặng Quốc Việt","HN038_Trần Huy Tùng","HN039_Phạm Tiến Ánh","HN040_Nguyễn Đức Toàn","HN041_Nguyễn Thị Hương Giang","HN042_Lê Văn Quang","HN043_Ngô Thế Vũ","HN044_Luyện Nhật Linh","HN045_Ngô Xuân Hiệp","HN046_Đỗ Huy Hoàng","HN047_Phạm Thị Diễm Trinh","HN048_Phan Văn Thanh","HN049_Trần Thanh Thế","HN050_Tô Mạnh Đức","HN051_Đỗ Tuấn Anh","HN052_Đặng Thị Huyền Trang","HN053_Phạm Văn Giang","HN054_Phạm Mạnh Tiến","HN055_Đỗ Trọng Trung","HN056_Đinh Vũ Nhật Linh","HN057_Trần Tuấn Dũng","HN058_Nguyễn Thị Yến","HN059_Trần Ngọc Văn","HN060_Bùi Minh Thái","HN061_Vũ Quỳnh Trang","HN062_Vũ Ngọc Khoa","HN063_Nguyễn Trần Nhàn","HN064_Bùi Thị Diễm Hằng","HN065_Đỗ Hoàng Hiếu","HN066_Trần Trung Hiếu","HN067_Trần Minh Thịnh","HN068_Lê Tuấn Minh","HN069_Vũ Việt Anh Tuấn","HN070_Lê Thị Thu Trang","HN071_Lê Tiến Anh","HN072_Trần Đình Tân","HN073_Lê Việt Hưng","HN074_Phan Trung Hưng","HN075_Vũ Quang Chính","HN076_Vũ Minh Hiếu","HN077_Trần Văn Tuyển","HN078_Đỗ Thị Hồng Anh","HN079_Vũ Thị Vân","HN080_Vũ Ngọc Khánh","HN081_Nguyễn Thị Hà ","HN082_Phan Kim Ngân","HN083_Trần Trọng Nghĩa","HN084_Nguyễn Thị Hồng Ánh","HN085_Đỗ Việt Anh","HN086_Nguyễn Công Toại","HN087_Nguyễn Thị Thoa","HN088_Đàm Thuận Hùng","HN089_Nguyễn Hương Giang","HN090_Dương Thị Quỳnh","HN091_Phạm Trọng Thành","HN092_Nguyễn Thị Yến","HN093_Ngô Minh Quang","HN094_Phạm Duy Niên","HN095_Lê Sỹ Trường Sơn","HN096_Trần Tiến Thành","HN097_Nguyễn Minh Quân","HN098_Nguyễn Hữu Quân","HN099_Lê Ngọc Trường","HN100_Nguyễn Văn Khánh","HN101_Nguyễn Văn Hiển","HN102_Vũ Đức Bảo","HN103_Vũ Văn Chức","HN104_Nguyễn Văn Minh","HN105_Đoàn Thị Hồng Nhung","HN106_Trịnh Hoài Nam","HN107_Vũ Duy Xuân","HN108_Lưu Phúc Huy","HN109_Nguyễn Anh Hoàng","HN110_Nguyễn Phương Hồng","HN111_Đào Hồng Quân","HN112_Đinh Duy Long","HN113_Đỗ Khoa Hải Phong","HN114_Lê Hồng Quân","HN115_Nguyễn Quang Duy","HN116_Nguyễn Thuỳ Dương","HN117_Phạm Hải Vân","HN118_Dương Văn Phúc","HN119_Nguyễn Hữu Tiến","HN120_Lê Thanh Nga","HN121_Phạm Thu Hà","HN122_Trần Hà Hữu Cường","SG001_Trương Ngọc Cẩm Vy","SG002_Nguyễn Hoàng Duy","SG003_Lê Văn Ý","SG004_Lê Thị Hồng Ân","SG005_Trương Ngọc Hưng","SG006_Võ Nhật Quang","SG007_Trần Thị Ánh Nhi","SG008_Đoàn Võ Nhựt Hào","SG009_Nguyễn Thị Thu Trang","SG010_Đặng Lê Đăng Khoa","SG011_Nguyễn Văn Hiệp","SG012_Phạm Ngọc Anh Tín","SG013_Đặng Ngọc Sang","SG014_Nguyễn Thanh Toàn","SG015_Nguyễn Anh Tuấn","SG016_Cảnh Lê Chí Tâm","SG017_Trần Thị Thu Hiền","SG018_Nguyễn Quốc Đạt","SG019_Trần Phi Long","SG020_Phạm Gia Bảo Đại","SG021_Vũ Hoài Trang","SG022_Lê Thanh Tuyền","SG023_Đoàn Thuỳ Trang","SG024_Nguyễn Trần Thy Ân","SG025_Nguyễn Lê Bảo Thy","SG026_Lê Quang Hưng","SG027_Phùng Chí Bảo","SG028_Lê Ngọc Thạch","SG029_Nguyễn Hoàng Anh Thư","SG030_Nguyễn Lê Linh","SG031_Nguyễn Phú Vinh","SG032_Lê Quang Tới","SG033_Mai Thị Ngọc Huyền","SG034_Dương Lê Quang Huy","SG035_Hoàng Huy Nhật","SG036_Nguyễn Hoàng Khánh Minh","SG037_Hoàng Trần Thiên Khôi","SG038_Ngô Mạnh Hùng","ĐN001_Trần Tùng Chi ","ĐN002_Lê Anh Thư","ĐN003_Đặng Hoàng Anh Quân","ĐN004_Nguyễn Thái Thiên","ĐN005_Lục Văn Minh","ĐN006_Nguyễn Ngọc Tuyên","ĐN007_Nguyễn Quang Nhân","ĐN008_Đinh Thị Uyên Thảo","ĐN009_Đinh Thị Thu Hiền","ĐN010_Đặng Văn Thiện","ĐN011_Lê Thị Lan Oanh","ĐN012_Nguyễn Thanh Trúc","ĐN013_Cao Thị Diệu Thu","ĐN014_Phan Ngọc Thanh Phương","ĐN015_Trần Văn Khánh","ĐN016_Phạm Thị Huệ","ĐN017_Nguyễn Tâm Vỹ","ĐN018_Vũ Thị Phương Thảo","ĐN019_Phan Hồng Thảo","ĐN020_Trần Chí Minh","ĐN021_Phạm Ánh Minh","ĐN022_Hồ Hoài Sản","ĐN023_Tạ Khánh Vân","ĐN024_Nguyễn Phi Long","ĐN025_Vũ Văn Duy","ĐN026_Tống Lê Thắng","ĐN027_Nguyễn Thị Ái Linh","ĐN028_Đoàn Hữu Nhân","ĐN029_Huỳnh Thị Ly","ĐN030_Mai Xuân Duy","ĐN031_Vũ Thanh Tuấn","ĐN032_Võ Đình Hoàng Long","ĐN033_Trần Thị Kim Yến","ĐN034_Nguyễn Quang Huy 1","ĐN035_Nguyễn Minh Luân","ĐN036_Nguyễn Đức Cường","ĐN037_Nguyễn Văn Mạnh","ĐN038_Trần Hữu Thọ","ĐN039_Nguyễn Văn Nhân","ĐN040_Đoàn Công Khanh","ĐN041_Trần Anh Tin","ĐN042_Hoàng Hà Chi","ĐN043_Hà Duy Anh","ĐN044_Vương Tấn Mạnh","ĐN045_Trần Đại","ĐN046_Đoàn Văn Vui","ĐN047_Đặng An Thiên","ĐN048_Nguyễn Việt Kha","ĐN049_Nguyễn Diệp Anh","ĐN050_Nguyễn Đức Minh Trí","ĐN051_Bùi Ngọc Quang","ĐN052_Cao Thị Thúy Hằng","ĐN053_Ngô Mỹ Hạnh ","ĐN054_Huỳnh Phúc Điền","ĐN055_Nguyễn Duy Phong","ĐN056_Huỳnh Bá Nhân"];
    this._excludeList = [
      'HN063_Nguyễn Trần Nhàn',
    ];
    this.havePreviousWinner = false;
    this.reelContainer = document.querySelector(reelContainerSelector);
    this.maxReelItems = maxReelItems;
    this.shouldRemoveWinner = removeWinner;
    this.onSpinStart = onSpinStart;
    this.onSpinEnd = onSpinEnd;
    this.onNameListChanged = onNameListChanged;

    // Create reel animation
    this.reelAnimation = this.reelContainer?.animate(
      [
        { transform: 'none', filter: 'blur(0)' },
        { filter: 'blur(1px)', offset: 0.5 },
        // Here we transform the reel to move up and stop at the top of last item
        // "(Number of item - 1) * height of reel item" of wheel is the amount of pixel to move up
        // 7.5rem * 16 = 120px, which equals to reel item height
        { transform: `translateY(-${(this.maxReelItems - 1) * (7.5 * 16)}px)`, filter: 'blur(0)' }
      ],
      {
        duration: this.maxReelItems * 100, // 100ms for 1 item
        easing: 'ease-in-out',
        iterations: 1
      }
    );

    this.reelAnimation?.cancel();
  }

  /**
   * Setter for name list
   * @param names  List of names to draw a winner from
   */
  set names(names: string[]) {
    this.nameList = names;

    const reelItemsToRemove = this.reelContainer?.children
      ? Array.from(this.reelContainer.children)
      : [];

    reelItemsToRemove
      .forEach((element) => element.remove());

    this.havePreviousWinner = false;

    if (this.onNameListChanged) {
      this.onNameListChanged();
    }
  }

  /** Getter for name list */
  get names(): string[] {
    return this.nameList;
  }

  get excludeList(): string[] {
    return this._excludeList;
  }

  /**
   * Setter for shouldRemoveWinner
   * @param removeWinner  Whether the winner should be removed from name list
   */
  set shouldRemoveWinnerFromNameList(removeWinner: boolean) {
    this.shouldRemoveWinner = removeWinner;
  }

  /** Getter for shouldRemoveWinner */
  get shouldRemoveWinnerFromNameList(): boolean {
    return this.shouldRemoveWinner;
  }

  /**
   * Returns a new array where the items are shuffled
   * @template T  Type of items inside the array to be shuffled
   * @param array  The array to be shuffled
   * @returns The shuffled array
   */
  private static shuffleNames<T = unknown>(array: T[]): T[] {
    const keys = Object.keys(array) as unknown[] as number[];
    const result: T[] = [];
    for (let k = 0, n = keys.length; k < array.length && n > 0; k += 1) {
      // eslint-disable-next-line no-bitwise
      const i = Math.random() * n | 0;
      const key = keys[i];
      result.push(array[key]);
      n -= 1;
      const tmp = keys[n];
      keys[n] = key;
      keys[i] = tmp;
    }
    return result;
  }

  /**
   * Function for spinning the slot
   * @returns Whether the spin is completed successfully
   */
  public async spin(): Promise<boolean> {
    if (!this.nameList.length) {
      console.error('Name List is empty. Cannot start spinning.');
      return false;
    }

    if (this.onSpinStart) {
      this.onSpinStart();
    }

    const { reelContainer, reelAnimation, shouldRemoveWinner } = this;
    if (!reelContainer || !reelAnimation) {
      return false;
    }

    // Shuffle names and create reel items
    let randomNames = Slot.shuffleNames<string>(this.nameList);

    while (randomNames.length && randomNames.length < this.maxReelItems) {
      randomNames = [...randomNames, ...randomNames];
    }

    randomNames = randomNames.slice(0, this.maxReelItems - Number(this.havePreviousWinner));
    if (this.excludeList.length === this.nameList.length) {
      return true;
    }
    if (this.excludeList.includes(randomNames[randomNames.length - 1])) {
      console.log('Winner is excluded, re-spin')
      return false;
    }

    const fragment = document.createDocumentFragment();

    randomNames.forEach((name) => {
      const newReelItem = document.createElement('div');
      newReelItem.innerHTML = name;
      fragment.appendChild(newReelItem);
    });

    reelContainer.appendChild(fragment);

    console.log('Displayed items: ', randomNames);
    console.log('Winner: ', randomNames[randomNames.length - 1]);

    // Remove winner form name list if necessary
    if (shouldRemoveWinner) {
      this.nameList.splice(this.nameList.findIndex(
        (name) => name === randomNames[randomNames.length - 1]
      ), 1);
    }

    console.log('Remaining: ', this.nameList);

    // Play the spin animation
    const animationPromise = new Promise((resolve) => {
      reelAnimation.onfinish = resolve;
    });

    reelAnimation.play();

    await animationPromise;

    // Sets the current playback time to the end of the animation
    // Fix issue for animatin not playing after the initial play on Safari
    reelAnimation.finish();

    Array.from(reelContainer.children)
      .slice(0, reelContainer.children.length - 1)
      .forEach((element) => element.remove());

    this.havePreviousWinner = true;

    if (this.onSpinEnd) {
      this.onSpinEnd();
    }
    return true;
  }
}
